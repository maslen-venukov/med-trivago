import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'
import Category from '../models/Category'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { schedule } = req.body
      if(!schedule) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните расписание')
      }

      const { categoryId } = req.params
      const category = await Category.findById(categoryId)
      if(!category) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Категория не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const services = await Service.find({ hospital: hospital._id, deleted: false })

      hospital.serviceList.push({ schedule, category: categoryId })
      await hospital.save()

      const currentHospital = {
        ...hospital._doc,
        serviceList: hospital.serviceList.map(list => ({
          ...list._doc,
          services: services.filter(service => list.category.toString() === service.category.toString())
        }))
      }

      return res.json({ message: 'Расписание успешно сохранено', hospital: currentHospital })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params

      const hospital = await Hospital.findOne({ user: req.user._id })
      const services = await Service.find({ hospital: hospital._id, deleted: false })

      hospital.serviceList = hospital.serviceList.filter(list => list.category.toString() !== categoryId)
      await hospital.save()

      await Service.updateMany({ hospital: hospital._id, category: categoryId }, { deleted: true })

      const currentHospital = {
        ...hospital._doc,
        serviceList: hospital.serviceList.map(list => ({
          ...list._doc,
          services: services.filter(service => list.category.toString() === service.category.toString())
        }))
      }
      return res.json({ message: 'Категория успешно деактивирована', hospital: currentHospital })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { schedule } = req.body
      if(!schedule) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните расписание')
      }

      const { categoryId } = req.params
      const category = await Category.findById(categoryId)
      if(!category) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Категория не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const services = await Service.find({ hospital: hospital._id, deleted: false })

      hospital.serviceList = hospital.serviceList.map(list => (
        list.category.toString() === categoryId
          ? { ...list._doc, schedule }
          : list._doc
      ))
      await hospital.save()

      const currentHospital = {
        ...hospital._doc,
        serviceList: hospital.serviceList.map(list => ({
          ...list._doc,
          services: services.filter(service => list.category.toString() === service.category.toString())
        }))
      }

      return res.json({ message: 'Расписание успешно изменено', hospital: currentHospital })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()