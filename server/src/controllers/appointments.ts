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
      const { name, date, phone, service: serviceId } = req.body

      if(!name || !date || !phone || !serviceId) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const service = await Service.findById(serviceId)
      const services = await Service.find({ category: service.category, hospital: service.hospital })
      const servicesIds = getUniqueIds(services)

      const existingAppointment = await Appointment.findOne({ date, service: { $in: servicesIds } })
      if(existingAppointment) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      const appointmentsByHospital = services.map(service => service.appointedDates).flat().map(service => service.toString())
      if(appointmentsByHospital.includes(new Date(date).toString())) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      const appointment = await Appointment.create({
        name,
        date,
        phone,
        service: serviceId
      })


      const result = { ...appointment._doc, service }

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
      const servicesIds = getUniqueIds(services)

      const appointments = await Appointment.find({ service: { $in: servicesIds }, deleted: false }).sort({ date: -1 })

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

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const appointment = await Appointment.findById(id)
      if(!appointment) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Запись не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const hospitalId = hospital._id.toString()

      const appointmentService = await Service.findById(appointment.service)
      if(appointmentService.hospital.toString() !== hospitalId) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { name, phone, date, service } = req.body

      const hospitalService = await Service.findById(service)
      if(hospitalService.hospital.toString() !== hospitalId) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      updateData(appointment, { name, phone, date, service })
      await appointment.save()

      const result = {
        ...appointment._doc,
        service: hospitalService
      }

      return res.json({ message: 'Запись успешно изменена', appointment: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const appointment = await Appointment.findById(id)
      if(!appointment) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Запись не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const service = await Service.findById(appointment.service)
      if(service.hospital.toString() !== hospital._id.toString()) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      appointment.deleted = true
      await appointment.save()

      return res.json({ message: 'Запись успешно удалена' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()