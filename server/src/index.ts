import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

import connectDB from './core/db'
import { corsOptions } from './core/cors'
import socket from './core/socket'

import usersRouter from './routes/users'
import categoriesRouter from './routes/categories'
import errorsRouter from './routes/errors'
import servicesRouter from './routes/services'
import hospitalsRouter from './routes/hospitals'
import registerLinksRouter from './routes/registerLinks'
import appointmentsRouter from './routes/appointments'
import serviceListsRouter from './routes/serviceLists'
import appointedDatesRouter from './routes/appointedDates'

const { PORT, MONGO_URI } = process.env

const app = express()
const server = http.createServer(app)

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/errors', errorsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/hospitals', hospitalsRouter)
app.use('/api/register-links', registerLinksRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/service-lists', serviceListsRouter)
app.use('/api/appointed-dates', appointedDatesRouter)

const start = async () => {
  try {
    await connectDB(MONGO_URI)
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    socket(server)
  } catch (e) {
    console.log(e)
  }
}

start()