import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'
import Appointment from '../models/Appointment'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import getUniqueIds from '../utils/getUniqueIds'
import updateData from '../utils/updateData'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const service = await Service.findById(req.params.serviceId)
      if(!service) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      if(service.hospital.toString() !== hospital._id.toString()) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { date } = req.body

      if(new Date(date) < new Date()) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Нельзя выбрать прошедшую дату')
      }

      service.appointedDates.push(new Date(date))
      await service.save()

      return res
        .status(HTTPStatusCodes.Created)
        .json({ message: 'Запись успешно добавлена' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  // async getByService(req: IUserRequest, res: Response): Promise<Response> {
  //   try {
  //     const service = await Service.findById(req.params.serviceId)
  //     if(!service) {
  //       return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
  //     }

  //     const appointments = await Appointment.find({ service: { $in: servicesIds }, deleted: false }).sort({ date: -1 })

  //     const result = appointments.map(appointment => {
  //       const service = services.find(service => service._id.toString() === appointment.service.toString())
  //       return { ...appointment._doc, service }
  //     })

  //     return res.json({ appointments: result })
  //   } catch (e) {
  //     console.log(e)
  //     await createError(e)
  //     return errorHandler(res)
  //   }
  // }
}

export default new Controller()