import { Request, Response } from 'express'

import { IUserRequest } from '../models/User'
import Category from '../models/Category'
import Service from '../models/Service'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { name } = req.body

      if(!name) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Введите название категории')
      }

      const existingCategory = await Category.findOne({ name })
      if(existingCategory) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Категория с таким названием уже существует')
      }

      const category = await Category.create({ name })

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
      const { name } = req.body

      if(!name) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Введите название категории')
      }

      const category = await Category.findByIdAndUpdate(id, { name }, { new: true })
      if(!category) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Категория не найдена')
      }

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