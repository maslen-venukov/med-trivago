import { Request, Response } from 'express'
import { v4 } from 'uuid'

import User, { IUserRequest } from '../models/User'
import RegisterLink from '../models/RegisterLink'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import sendEmail from '../utils/sendEmail'

import { HTTPStatusCodes, Roles } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
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
        html: `Чтобы зарегистрироваться, перейдите по <a href="${process.env.CLIENT_URL}/register/${link}">ссылке</a>`
      }, async e => {
        if(e) {
          console.log(e)
          await createError(e)
          return errorHandler(res, HTTPStatusCodes.BadRequest, 'Не удалось отправить письмо')
        } else {
          await RegisterLink.deleteOne({ email })
          const registerLink = await RegisterLink.create({ link, email })
          return res
            .status(HTTPStatusCodes.Created)
            .json({ message: 'Приглашение успешно отправлено', registerLink })
        }
      })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByLink(req: Request, res: Response): Promise<Response> {
    try {
      const { link } = req.params

      const registerLink = await RegisterLink.findOne({ link })

      return res.json({ link: registerLink?.link || null })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()