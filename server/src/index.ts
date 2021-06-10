import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import connectDB from './core/db'

import accountsRouter from './routes/accounts'
import categoriesRouter from './routes/categories'
import errorsRouter from './routes/errors'
import servicesRouter from './routes/services'

// import Account from './models/Account'
// import Category from './models/Category'
import Hospital from './models/Hospital'
import Service from './models/Service'

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/accounts', accountsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/errors', errorsRouter)
app.use('/api/services', servicesRouter)

const start = async () => {
  try {
    await connectDB(MONGO_URI)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

    // const account = new Account({
    //   login: 'login',
    //   password: 'password'
    // })
    // await account.save()

    // await Category.insertMany([{ name: 'МРТ' }, { name: 'УЗИ' }])

    // const hospital = new Hospital({
    //   name: 'Национальный диагностическая центр',
    //   address: 'ул. Народная, 8/1',
    //   workingHours: {
    //     start: '08:00',
    //     end: '00:00'
    //   },
    //   phone: '8 (922) 817-33-96',
    //   serviceList: [
    //     {
    //       category: '60bf248c6f318b3af4fdbbec',
    //       workingHours: {
    //         start: '08:00',
    //         end: '00:00'
    //       },
    //       list: [
    //         { name: 'МРТ гипофиза', price: 1500 },
    //         { name: 'МРТ гипофиза с контрастом', price: 5000 },
    //         { name: 'МРТ головного мозга', price: 2100 }
    //       ]
    //     },
    //     {
    //       category: '60bf248c6f318b3af4fdbbed',
    //       workingHours: {
    //         start: '08:00',
    //         end: '20:00'
    //       },
    //       list: [
    //         { name: 'УЗИ поджелудочной железы', price: 300 },
    //         { name: 'УЗИ почек и мочевого пузыря', price: 600 },
    //         { name: 'УЗИ селезнки', price: 300 },
    //         { name: 'УЗИ коленного сустава', price: 500 }
    //       ]
    //     }
    //   ],
    //   account: '60bf248c6f318b3af4fdbbeb'
    // })

    // await hospital.save()

    // await Service.insertMany([
    //   { name: 'УЗИ поджелудочной железы', price: 300, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbed' },
    //   { name: 'УЗИ почек и мочевого пузыря', price: 600, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbed' },
    //   { name: 'УЗИ селезнки', price: 300, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbed' },
    //   { name: 'УЗИ коленного сустава', price: 500, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbed' },
    //   { name: 'МРТ гипофиза', price: 1500, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbec' },
    //   { name: 'МРТ гипофиза с контрастом', price: 5000, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbec' },
    //   { name: 'МРТ головного мозга', price: 2100, hospital: '60bf42ae939b7445ccb45b04', category: '60bf248c6f318b3af4fdbbec' }
    // ])
  } catch (e) {
    console.log(e)
  }
}

start()