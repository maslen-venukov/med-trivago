import { Request, Response } from 'express'
import { v4 } from 'uuid'

import { IUserRequest } from '../models/User'
import RegisterLink from '../models/RegisterLink'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import sendEmail from '../utils/sendEmail'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { email } = req.body

      if(!email) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Введите email')
      }

      const link = v4()

      sendEmail({
        from: `MeDi — Медицинская Диагностика ${process.env.NODEMAILER_USER}`,
        to: email,
        subject: 'MeDi — Медицинская Диагностика',
        html: `
          <h3>Единый портал MeDi онлайн запись на медицинскую диагностику приглашает Вас к сотрудничеству. Для регистрации просим Вас перейти по <a href="${process.env.CLIENT_URL}/register/${link}">ссылке</a></h3>
          <p>Разместите информацию о своих услугах на нашем ресурсе.</p>
          <p>Онлайн запись <strong><a href="http://me-di.ru">MeDi</a></strong> предоставляет возможность пациентам записаться к Вам на медицинскую диагностику на удобное время. 24 часа в сутки, не выходя из дома, из любой точки страны.  Запись отображается у вас в личном кабинете сразу с момента бронирования.</p>
          <p>С уважением к Вам и Вашему бизнесу команда <strong><a href="http://me-di.ru">MeDi</a></strong>.</p>
        `
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

  async getAll(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const registerLinks = await RegisterLink.find().sort({ _id: -1 })
      return res.json({ registerLinks })
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

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const registerLink = await RegisterLink.findByIdAndDelete(id)
      if(!registerLink) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Приглашение не найдено')
      }

      return res.json({ message: 'Приглашение отменено' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()