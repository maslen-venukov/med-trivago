import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Appointment from '../models/Appointment'
import Service from '../models/Service'
import Hospital from '../models/Hospital'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

class Controller {
    async getCount(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const appointments = await Appointment.countDocuments()
      const services = await Service.countDocuments()
      const hospitals = await Hospital.countDocuments()
      return res.json({ appointments, services, hospitals })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()