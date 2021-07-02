import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
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

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params

      const hospital = await Hospital.findOne({ user: req.user._id })
      const services = await Service.find({ hospital: hospital._id, deleted: { $ne: true } })

      hospital.serviceList = hospital.serviceList.filter(list => list.category.toString() !== categoryId)
      await hospital.save()

      await Service.updateMany({ hospital: hospital._id, category: categoryId }, { deleted: true })

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
      const { categoryId } = req.params
      console.log(categoryId)
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()