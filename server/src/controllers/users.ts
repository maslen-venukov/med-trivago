import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User, { IUser, IUserRequest } from '../models/User'

import register from '../services/register'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes } from '../types'

const SECRET_KEY = process.env.SECRET_KEY
const TOKEN_LIFETIME = process.env.TOKEN_LIFETIME

class Controller {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, passwordCheck } = req.body

      const user = await register(email, password, passwordCheck)

      const { error } = user

      if(error) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, error)
      }

      const { _id, role } = await User.create(user)

      const data = { _id, email, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res
        .status(HTTPStatusCodes.Created)
        .json({
          token,
          user: data,
          message: 'Регистрация выполнена успешно'
        })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password }: IUser = req.body

      if(!email || !password) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля' )
      }

      const user = await User.findOne({ email })
      if(!user) {
        return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Неверный email или пароль' )
      }

      const isMatch = bcrypt.compareSync(password, user.password)
      if(!isMatch) {
        return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Неверный email или пароль' )
      }

      const { _id, role } = user
      const data = { _id, email, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res.json({
        token,
        user: data,
        message: 'Авторизация выполнена успешно'
      })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async auth(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user._id)

      if(!user) {
        return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Не удалось авторизоваться')
      }

      const { _id, email, role } = user
      const data = { _id, email, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res.json({
        token,
        user: data
      })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()