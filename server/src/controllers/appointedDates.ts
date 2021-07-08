import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'
import Appointment from '../models/Appointment'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import getUniqueIds from '../utils/getUniqueIds'

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

      const services = await Service.find({ hospital: hospital._id, deleted: false })
      const currentHospital = {
        ...hospital._doc,
        serviceList: hospital.serviceList.map(list => ({
          ...list._doc,
          services: services.filter(service => list.category.toString() === service.category.toString())
        }))
      }

      return res
        .status(HTTPStatusCodes.Created)
        .json({ message: 'Запись успешно добавлена', hospital: currentHospital })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByService(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { serviceId } = req.params

      const service = await Service.findById(serviceId)
      if(!service) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      const services = await Service.find({ category: service.category, hospital: service.hospital })
      const byHospital = services.map(service => service.appointedDates).flat()

      const servicesIds = getUniqueIds(services)
      const appointments = await Appointment.find({ service: { $in: servicesIds } })
      const byCustomers = appointments.map(appointment => appointment.date)

      const appointedDates = [...byCustomers, ...byHospital]

      return res.json({ appointedDates })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()