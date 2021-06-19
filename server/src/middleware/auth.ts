import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { IUserRequest } from '../models/User'

import errorHandler from '../utils/errorHandler'

import { HTTPStatusCodes } from '../types'

const auth = (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization

    if(!token) {
      return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Не удалось авторизоваться')
    }

    const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
    req.user = decoded

    next()
  } catch (e) {
    console.log(e)
    return errorHandler(res, HTTPStatusCodes.Unauthorized, 'Не удалось авторизоваться')
  }
}

export default auth