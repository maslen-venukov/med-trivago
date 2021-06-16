import { Request, Response } from 'express'

import User, { IUserRequest } from '../models/User'
import Category, { ICategory } from '../models/Category'

import errorHandler from '../utils/errorHandler'
import isValidObjectId from '../utils/isValidObjectId'
import createError from '../utils/createError'

import { HTTPStatusCodes, Roles } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user._id)

      if(user.role !== Roles.Admin) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { name } = req.body
      const category = new Category({ name })
      await category.save()

      return res.status(HTTPStatusCodes.Created).json({ message: 'Категория успешно создана', category })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const categories: ICategory[] = await Category.find().sort({ _id: -1 })
      return res.json({ categories })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user._id)
      if(user.role !== Roles.Admin) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { id } = req.params
      if(!isValidObjectId(id)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Некорректный ID')
      }

      const category = await Category.findById(id)
      if(!category) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Категория не найдена')
      }

      const { name } = req.body
      category.name = name
      await category.save()

      return res.json({ message: 'Категория успешно изменена', category })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user._id)

      if(user.role !== Roles.Admin) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { id } = req.params
      if(!isValidObjectId(id)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Некорректный ID')
      }

      await Category.deleteOne({ _id: id })

      return res.json({ message: 'Категория успешно удалена' })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()