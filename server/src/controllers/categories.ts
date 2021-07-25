import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

import { IUserRequest } from '../models/User'
import Category from '../models/Category'
import Service from '../models/Service'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import updateData from '../utils/updateData'

import { HTTPStatusCodes } from '../types'

const removeFile = (filename?: string) => {
  if(!filename) {
    return
  }
  try {
    fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', filename))
  } catch (e) {
    console.log(e)
  }
}

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body
      const { filename } = req.file

      if(!name || !description) {
        removeFile(filename)
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const existingCategory = await Category.findOne({ name })
      if(existingCategory) {
        removeFile(filename)
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Категория с таким названием уже существует')
      }

      const category = await Category.create({ name, description, image: filename })

      return res.status(HTTPStatusCodes.Created).json({ message: 'Категория успешно создана', category })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await Category.find().collation({ locale: 'ru' }).sort('name')
      return res.json({ categories })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { name, description } = req.body
      const filename = req.file?.filename

      if(!name || !description) {
        removeFile(filename)
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const category = await Category.findById(id)
      if(!category) {
        removeFile(filename)
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Категория не найдена')
      }

      if(filename) {
        removeFile(category.image)
      }
      updateData(category, { name, description, image: filename || category.image })
      await category.save()

      return res.json({ message: 'Категория успешно изменена', category })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const category = await Category.findById(id)
      if(!category) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Категория не найдена')
      }

      const services = await Service.find({ category: category._id })
      if(services.length) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Нельзя удалить категорию, по которой предоставляются услуги')
      }

      removeFile(category.image)
      await category.deleteOne()
      return res.json({ message: 'Категория успешно удалена' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()