import { CookieOptions } from 'express'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 3600 * 24
}