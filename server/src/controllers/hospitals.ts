import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

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

import { HTTPStatusCodes, Roles } from '../types'

const SECRET_KEY = process.env.SECRET_KEY
const TOKEN_LIFETIME = process.env.TOKEN_LIFETIME

class Controller {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, passwordCheck, name, address, phone, schedule, link } = req.body

      const userData = await register(email, password, passwordCheck)

      const registerError = userData.error
      if(registerError) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, registerError)
      }

      if(!name || !address || !phone || !schedule.start || !schedule.end || !link) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const existingHospital = await Hospital.findOne().or([{ name }, { address }, { phone }])
      if(existingHospital) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Медицинское учреждение с такими данными уже зарегистрировано')
      }

      const registerLink = await RegisterLink.findOne({ link })
      if(!registerLink) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Недействительный регистрационный номер')
      }

      const role = Roles.Hospital

      const user = await User.create({ ...userData, role })
      const hospital = await Hospital.create({ name, address, phone, schedule, user: user._id })
      await RegisterLink.deleteOne({ link })

      const data = { _id: user._id, email, role }

      const token = `Bearer ${jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

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
      const services = await Service.find({ deleted: { $ne: true }})

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

      const services = await Service.find({ hospital: hospital._id, deleted: { $ne: true } })

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

      const { name, address, phone, schedule } = req.body
      updateData(hospital, { name, address, phone, schedule })

      await hospital.save()
      return res.json({ message: 'Информация успешно обновлена', hospital })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async addServiceList(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { schedule, category } = req.body
      if(!schedule || !category) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const services = await Service.find({ hospital: hospital._id, deleted: { $ne: true } })

      hospital.serviceList.push({ schedule, category })
      await hospital.save()

      const result = {
        ...hospital._doc,
        serviceList: hospital.serviceList.map(list => ({
          ...list._doc,
          services: services.filter(service => list.category.toString() === service.category.toString())
        }))
      }

      return res.json({ message: 'Расписание успешно сохранено', hospital: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async removeServiceList(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params

      const hospital = await Hospital.findOne({ user: req.user._id })
      const services = await Service.find({ hospital: hospital._id, deleted: { $ne: true } })
      const servicesIds = [...new Set(services.map(service => service._id.toString()))]

      hospital.serviceList = hospital.serviceList.filter(list => list.category.toString() !== categoryId)
      await hospital.save()

      await Service.updateMany({ _id: servicesIds }, { deleted: true })

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

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const hospital = await Hospital.findByIdAndDelete(id)
      if(!hospital) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Медицинское учреждение не найдено')
      }

      const services = await Service.find({ hospital: hospital._id })
      const servicesIds = [...new Set(services.map(service => service._id.toString()))]

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