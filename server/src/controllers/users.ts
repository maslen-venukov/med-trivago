import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User, { IUser, IUserRequest } from '../models/User'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes } from '../types'

const SECRET_KEY = process.env.SECRET_KEY
const TOKEN_LIFETIME = '24h'

class Controller {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, passwordCheck } = req.body

      if(!email || !password || !passwordCheck) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      if(password !== passwordCheck) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Пароли не совпадают' )
      }

      const passwordRegExp = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
      if(!password.match(passwordRegExp)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Пароль должен содержать не менее 6 символов, строчные и заглавные буквы латинского алфавита, хотя бы одно число и специальный символ')
      }

      const candidate = await User.findOne({ email })
      if(candidate) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Пользователь с таким email уже зарегистрирован' )
      }

      const hashedPassword = bcrypt.hashSync(password, 7)

      const user = await User.create({
        email,
        password: hashedPassword
      })

      const { _id, role } = user
      const data = { _id, email, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res
        .status(HTTPStatusCodes.Created)
        .json({
          token,
          user: data,
          message: 'Пользователь успешно зарегистрирован'
        })
    } catch (e) {
      console.log(e)
      createError(e)
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
      createError(e)
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
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()