import mailer from '../core/mailer'
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport'

import createError from './createError'

interface ISendEmailOptions {
  from: string
  to: string
  subject: string
  html: string
}

type SendEmailCallback = (err?: Error | null, info?: SentMessageInfo) => void

const sendEmail = (options: ISendEmailOptions, cb?: SendEmailCallback) => {
  const { from, to, subject, html } = options
  mailer.sendMail({
    from,
    to,
    subject,
    html
  }, cb || function(err: Error | null, info: SentMessageInfo) {
    console.log(err || info)
    createError(err)
  })
}

export default sendEmail