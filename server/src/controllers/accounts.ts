import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Account, { IAccount, IAccountRequest } from '../models/Account'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes } from '../types'

const SECRET_KEY = process.env.SECRET_KEY
const TOKEN_LIFETIME = '24h'

class Controller {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { login, password, passwordCheck } = req.body

      if(!login || !password || !passwordCheck) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      if(password !== passwordCheck) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Пароли не совпадают' )
      }

      const passwordRegExp = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
      if(!password.match(passwordRegExp)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Пароль должен содержать не менее 6 символов, строчные и заглавные буквы латинского алфавита, хотя бы одно число и специальный символ')
      }

      const candidate = await Account.findOne({ login })
      if(candidate) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Аккаунт с таким именем уже зарегистрирован' )
      }

      const hashedPassword = bcrypt.hashSync(password, 7)

      const account = new Account({
        login,
        password: hashedPassword
      })

      const { _id, role } = account
      const data = { _id, login, role }
      await account.save()

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res
        .status(HTTPStatusCodes.Created)
        .json({
          token,
          account: data,
          message: 'Аккаунт успешно зарегистрирован'
        })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { login, password }: IAccount = req.body

      if(!login || !password) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля' )
      }

      const account = await Account.findOne({ login })
      if(!account) {
        return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Неверный логин или пароль' )
      }

      const isMatch = bcrypt.compareSync(password, account.password)
      if(!isMatch) {
        return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Неверный логин или пароль' )
      }

      const { _id, role } = account
      const data = { _id, login, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res.json({
        message: 'Авторизация выполнена успешно',
        token,
        account: data
      })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

  async auth(req: IAccountRequest, res: Response): Promise<Response> {
    try {
      const account = await Account.findById(req.account._id)

      if(!account) {
        return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Не удалось авторизоваться')
      }

      const { _id, login, role } = account
      const data = { _id, login, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

      return res.json({
        token,
        account: data
      })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()