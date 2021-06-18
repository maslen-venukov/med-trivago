import { Response } from 'express'
import { v4 } from 'uuid'

import User, { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Category from '../models/Category'
import Service from '../models/Service'
import RegisterLink from '../models/RegisterLink'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import sendEmail from '../utils/sendEmail'

import { HTTPStatusCodes, Roles } from '../types'

class Controller {
  async invite(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const account = await User.findById(req.user._id)

      if(account.role !== Roles.Admin) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { email } = req.body

      if(!email) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Введите email')
      }

      const link = v4()

      sendEmail({
        from: `Запись на анализы ${process.env.NODEMAILER_USER}`,
        to: email,
        subject: 'Приглашение',
        html: `Чтобы зарегистрироваться перейдите по <a href="${process.env.CLIENT_URL}/register/${link}">ссылке</a>`
      }, async e => {
        if(e) {
          console.log(e)
          createError(e)
          return errorHandler(res, HTTPStatusCodes.BadRequest, 'Не удалось отправить письмо')
        } else {
          const registerLink = await RegisterLink.create({ link })
          return res.status(HTTPStatusCodes.Created).json({ message: 'Приглашение успешно отправлено', registerLink })
        }
      })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

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