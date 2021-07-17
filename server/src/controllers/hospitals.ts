import { Request, Response } from 'express'

import { cookieOptions } from '../core/cookie'

import User, { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Category from '../models/Category'
import Service from '../models/Service'
import RegisterLink from '../models/RegisterLink'
import Appointment from '../models/Appointment'

import register from '../services/register'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import updateData from '../utils/updateData'
import getUniqueIds from '../utils/getUniqueIds'
import createToken from '../utils/createToken'

import { HTTPStatusCodes, Roles } from '../types'

class Controller {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, passwordCheck, name, city, address, phone, website, schedule, link } = req.body

      const userData = await register(email, password, passwordCheck)

      const registerError = userData.error
      if(registerError) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, registerError)
      }

      if(!name || !city || !address || !phone || !schedule.start || !schedule.end || !link) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const existingHospital = await Hospital.findOne({ $or: [{ name }, { phone }] })
      if(existingHospital) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Медицинское учреждение с такими данными уже зарегистрировано')
      }

      const registerLink = await RegisterLink.findOne({ link })
      if(!registerLink) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Недействительный регистрационный номер')
      }

      const role = Roles.Hospital

      const user = await User.create({ ...userData, role })
      const hospital = await Hospital.create({ name, city, address, phone, website, schedule, user: user._id })
      await RegisterLink.deleteOne({ link })

      const data = { _id: user._id, email, role }
      const token = createToken(data)

      return res
        .status(HTTPStatusCodes.Created)
        .cookie('token', token, cookieOptions)
        .json({
          user: data,
          hospital,
          message: 'Регистрация выполнена успешно'
        })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getAll(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const hospitals = await Hospital.find().sort({ _id: -1 })
      const categories = await Category.find()
      const services = await Service.find({ deleted: false})

      const result = hospitals.map(hospital => {
        const { _id, name, address, phone, schedule } = hospital
        const serviceList = hospital.serviceList.map(list => {
          const category = categories.find(category => category._id.toString() === list.category.toString())

          const listServices = services.filter(service => {
            const thisCategory = service.category.toString() === category._id.toString()
            const thisHospital = service.hospital.toString() === hospital._id.toString()
            return thisCategory && thisHospital
          })

          return {
            category: category.name,
            schedule: list.schedule,
            services: listServices.map(({ _id, name, price }) => ({ _id, name, price }))
          }
        })

        return {
          _id,
          name,
          address,
          phone,
          schedule,
          serviceList
        }
      })

      return res.json({ hospitals: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByUser(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const hospital = await Hospital.findOne({ user: req.user._id })

      const services = await Service.find({ hospital: hospital._id, deleted: false })

      const result = {
        ...hospital._doc,
        serviceList: hospital.serviceList.map(list => ({
          ...list._doc,
          services: services.filter(service => list.category.toString() === service.category.toString())
        }))
      }

      return res.json({ hospital: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const hospital = await Hospital.findOne({ user: req.user._id })

      const { name, city, address, phone, website, schedule } = req.body
      updateData(hospital, { name, city, address, phone, website, schedule })

      await hospital.save()
      return res.json({ message: 'Информация успешно обновлена', hospital })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const hospital = await Hospital.findByIdAndDelete(id)
      if(!hospital) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Медицинское учреждение не найдено')
      }

      const services = await Service.find({ hospital: hospital._id })
      const servicesIds = getUniqueIds(services)

      await Service.deleteMany({ hospital: id })
      await Appointment.deleteMany({ service: { $in: servicesIds } })
      await User.deleteOne({ _id: hospital.user })

      return res.json({ message: 'Медицинское учреждение успешно удалено' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()