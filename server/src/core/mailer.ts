import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const options: SMTPTransport.Options = {
  host: 'smtp.timeweb.ru',
  port: 2525,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
}

const transport = nodemailer.createTransport(options)

export default transport