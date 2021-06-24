import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

import connectDB from './core/db'

import usersRouter from './routes/users'
import categoriesRouter from './routes/categories'
import errorsRouter from './routes/errors'
import servicesRouter from './routes/services'
import hospitalsRouter from './routes/hospitals'
import registerLinksRouter from './routes/registerLinks'
// import Hospital from './models/Hospital'

const { PORT, MONGO_URI, CLIENT_URL } = process.env

const app = express()

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/errors', errorsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/hospitals', hospitalsRouter)
app.use('/api/register-links', registerLinksRouter)

const start = async () => {
  try {
    await connectDB(MONGO_URI)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    // await Hospital.create({
    //   _id: '60ce47ed06b6c506dcaa3f51',
    //   name: 'Национальный диагностический центр',
    //   address: 'ул. Народная, 8/1',
    //   phone: '49-01-08',
    //   schedule: {
    //     start: '08:00',
    //     end: '00:00'
    //   },
    //   serviceList: [
    //     {
    //       category: '60bf248c6f318b3af4fdbbec',
    //       schedule: {
    //         weekdays: {
    //           start: '08:00',
    //           end: '00:00'
    //         },
    //         saturday: {
    //           start: '08:00',
    //           end: '00:00'
    //         },
    //         sunday: {
    //           start: '08:00',
    //           end: '00:00'
    //         }
    //       }
    //     },
    //     {
    //       category: '60bf248c6f318b3af4fdbbed',
    //       schedule: {
    //         weekdays: {
    //           start: '08:00',
    //           end: '20:00'
    //         },
    //         saturday: {
    //           start: '08:00',
    //           end: '20:00'
    //         }
    //       }
    //     },
    //   ],
    //   user: '60ce47ed06b6c506dcaa3f50'
    // })
  } catch (e) {
    console.log(e)
  }
}

start()