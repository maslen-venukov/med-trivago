import { Response } from 'express'
import { HTTPStatusCodes } from '../types'

const errorHandler = (
  res: Response,
  status: number = HTTPStatusCodes.InternalServerError,
  message: string = 'Что-то пошло не так'
): Response => {
  return res.status(status).json({ message })
}

export default errorHandler