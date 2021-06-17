import { Response } from 'express'

import User, { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Category from '../models/Category'
import Service from '../models/Service'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

import { HTTPStatusCodes, Roles } from '../types'

class Controller {
  async getAll(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const account = await User.findById(req.user._id)

      if(account.role !== Roles.Admin) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const hospitals = await Hospital.find().sort({ _id: -1 })
      const categories = await Category.find()
      const services = await Service.find()

      const result = hospitals.map(hospital => {
        const { _id, name, address, phone, schedule } = hospital
        const serviceList = hospital.serviceList.map(list => {
          const category = categories.find(category => category._id.toString() === list.category.toString())
          const listServices = services.filter(service => service.category.toString() === category._id.toString())
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
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()