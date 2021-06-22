import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Error, { IError } from '../models/Error'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

class Controller {
  async getAll(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const errors: IError[] = await Error.find().sort({ _id: -1 })
      return res.json({ errors })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()