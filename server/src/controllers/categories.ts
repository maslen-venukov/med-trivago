import { Request, Response } from 'express'

import { IUserRequest } from '../models/User'
import Category, { ICategory } from '../models/Category'

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
      const categories: ICategory[] = await Category.find().sort('name')
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

      await Category.deleteOne({ _id: id })

      return res.json({ message: 'Категория успешно удалена' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()