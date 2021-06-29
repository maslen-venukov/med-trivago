import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'
import Appointment from '../models/Appointment'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import isValidObjectId from '../utils/isValidObjectId'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { name, date, phone, service } = req.body

      if(!name || !date || !phone || !service) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const existingAppointment = await Appointment.findOne({ date, service })
      if(existingAppointment) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      const appointment = await Appointment.create({
        name,
        date,
        phone,
        service
      })

      const appointmentService = await Service.findById(service)

      const result = { ...appointment._doc, service: appointmentService }

      return res
        .status(HTTPStatusCodes.Created)
        .json({ message: 'Вы успешно записались', appointment: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByHospital(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const hospital = await Hospital.findOne({ user: req.user._id })

      const services = await Service.find({ hospital: hospital._id })
      const servicesIds = [...new Set(services.map(service => service._id.toString()))]

      const appointments = await Appointment.find({ service: { $in: servicesIds } }).sort({ _id: -1 })

      const result = appointments.map(appointment => {
        const service = services.find(service => service._id.toString() === appointment.service.toString())
        return { ...appointment._doc, service }
      })

      return res.json({ appointments: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getAppointedDates(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { serviceId } = req.params

      const appointments = await Appointment.find({ service: serviceId })

      const result = appointments.map(appointment => appointment.date)

      return res.json({ appointedDates: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()