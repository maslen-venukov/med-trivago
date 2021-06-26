import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true
}