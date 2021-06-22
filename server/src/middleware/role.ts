import { Response, NextFunction } from 'express'

import { IUserRequest } from '../models/User'

import errorHandler from '../utils/errorHandler'

import { HTTPStatusCodes, Roles } from '../types'

const role = (role: Roles) => {
  return (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      if(req.user.role !== role) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      next()
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }
}

export default role