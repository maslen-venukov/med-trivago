import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { IAccountRequest } from '../models/Account'

import errorHandler from '../utils/errorHandler'

import { HTTPStatusCodes } from '../types'

const auth = (req: IAccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization

    if(!token) {
      return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Не удалось авторизоваться')
    }

    const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
    req.account = decoded

    next()
  } catch (e) {
    console.log(e)
    return errorHandler(res)
  }
}

export default auth