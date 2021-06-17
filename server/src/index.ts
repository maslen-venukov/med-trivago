import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import connectDB from './core/db'

import usersRouter from './routes/users'
import categoriesRouter from './routes/categories'
import errorsRouter from './routes/errors'
import servicesRouter from './routes/services'
import hospitalsRouter from './routes/hospitals'

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/errors', errorsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/hospitals', hospitalsRouter)

const start = async () => {
  try {
    await connectDB(MONGO_URI)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()