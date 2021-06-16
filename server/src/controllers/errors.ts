import { Response } from 'express'

import User, { IUserRequest } from '../models/User'
import Error, { IError } from '../models/Error'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes, Roles } from '../types'

class Controller {
  async getAll(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const account = await User.findById(req.user._id)

      if(account.role !== Roles.Admin) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const errors: IError[] = await Error.find().sort({ _id: -1 })

      return res.json({ errors })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()