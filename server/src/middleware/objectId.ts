import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { IUserRequest } from '../models/User'

import errorHandler from '../utils/errorHandler'

import { HTTPStatusCodes } from '../types'

const objectId = (paramName = 'id') => {
  return (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params[paramName]

      if(!mongoose.Types.ObjectId.isValid(id)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Некорректный ID')
      }

      next()
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }
}

export default objectId