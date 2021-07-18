import { Request, Response } from 'express'

import { IUserRequest } from '../models/User'
import Service, { IService } from '../models/Service'
import Category from '../models/Category'
import Hospital from '../models/Hospital'
import Appointment from '../models/Appointment'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import getUniqueIds from '../utils/getUniqueIds'

import { HTTPStatusCodes } from '../types'
import updateData from '../utils/updateData'

type NameFilter = RegExp | null

type CategoryFilter = string | null

interface IPriceFilter {
  $gte?: number
  $lte?: number
}

type PriceFilter = IPriceFilter | null

interface IFilters {
  name?: RegExp
  price?: IPriceFilter
  category?: CategoryFilter
}

interface ISort {
  _id?: string
  price?: string
}

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { name, price, category: categoryId } = req.body
      if(!name || !price || !categoryId) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const category = await Category.findById(categoryId)
      if(!category) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Категория не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })

      const activeCategory = hospital.serviceList.find(list => list.category.toString() === categoryId)
      if(!activeCategory) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Категория не активна')
      }

      const service = await Service.create({
        name,
        price,
        category,
        hospital: hospital._id
      })

      const result = { ...service._doc, category: category.name }

      return res.json({ message: 'Услуга успешно добавлена', service: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { q, cat, city, minp, maxp, p } = req.query

      let name: NameFilter = null
      if(q && typeof q === 'string') {
        name = new RegExp(q, 'gi')
      }

      let category: CategoryFilter = null
      if(cat && typeof cat === 'string') {
        const obj = await Category.findOne({ name: cat })
        category = obj?._id || null
      }

      let price: PriceFilter = null
      if(minp) price = { ...price, $gte: Number(minp)}
      if(maxp) price = { ...price, $lte: Number(maxp)}

      let sort: ISort = { _id: 'desc' }
      if(p && typeof p === 'string') {
        sort = { price: p }
      }

      const filters = { name, category, price }
      const find: IFilters = Object.keys(filters).reduce((acc, key) => {
        const value = filters[key]
        if(!value) {
          return acc
        }
        return { ...acc, [key]: value }
      }, {})

      const services = await Service.find({ ...find, deleted: false }).sort(sort)

      const hospitalsIds = getUniqueIds(services, 'hospital')
      const hospitals = await Hospital.find({ _id: hospitalsIds })

      const withHospitals = services.reduce((acc, service) => {
        const hospital = hospitals.find(hospital => hospital._id.toString() === service.hospital.toString())

        if(city && city !== hospital.city) {
          return acc
        }

        return acc = [
          ...acc,
          {
            ...service._doc,
            hospital: {
              name: hospital.name,
              city: hospital.city,
              address: hospital.address,
              phone: hospital.phone
            }
          }
        ]
      }, [])

      const groupBy = <T>(arr: T[], key: string): T[][] => {
        const values = arr.reduce((acc, el) => {
          (acc[el[key]] = acc[el[key]] || []).push(el)
          return acc
        }, {})
        return Object.values(values)
      }

      const getMinValue = <T>(arr: T[], key: string): number => {
        return arr.reduce((min: number, next) => next[key] < min ? next[key] : min, arr[0][key])
      }

      const grouped = groupBy(withHospitals, 'name')

      const mapped = grouped.map(group => {
        const name = group[0].name
        const min = getMinValue(group, 'price')
        const services = group.sort((a, b) => a.price > b.price ? 1 : -1)
        return {
          name,
          min,
          services
        }
      })

      return res.json({ searched: mapped })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getCompare(req: Request, res: Response): Promise<Response> {
    try {
      const { serviceName } = req.params

      const services = await Service.find({ name: serviceName, deleted: false })
      if(!services.length) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      const hospitalsIds = getUniqueIds(services, 'hospital')
      const hospitals = await Hospital.find({ _id: hospitalsIds })

      const compared = services
        .sort((a, b) => a.price > b.price ? 1 : -1)
        .map(service => {
          const hospital = hospitals.find(hospital => hospital._id.toString() === service.hospital.toString())
          const { name, city, address, phone } = hospital
          return {
            ...service._doc,
            hospital: { name, city, address, phone }
          }
        })

      return res.json({ compared })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const service = await Service.findOne({ _id: id, deleted: false })
      if(!service) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      const category = await Category.findById(service.category)
      const hospital = await Hospital.findById(service.hospital)

      const serviceList = hospital.serviceList.find(list => list.category.toString() === category._id.toString())
      const schedule = serviceList?.schedule || { weekdays: hospital.schedule }

      const result = {
        ...service._doc,
        category: category.name,
        schedule,
        hospital
      }

      return res.json({ service: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByHospital(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const hospital = await Hospital.findOne({ user: req.user._id })

      const services = await Service
        .find({ hospital: hospital._id, deleted: false })
        .collation({ locale: 'ru' })
        .sort('name')

      const categoriesIds = getUniqueIds(services, 'category')
      const categories = await Category.find({ _id: categoriesIds })

      const result = services.map(service => {
        return {
          ...service._doc,
          category: categories.find(category => category._id.toString() === service.category.toString()).name
        }
      })

      return res.json({ services: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const service = await Service.findById(id)
      if(!service) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      if(hospital._id.toString() !== service.hospital.toString()) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { name, price, category } = req.body

      const serviceList = hospital.serviceList.find(list => list.category.toString() === category)
      if(!(category && serviceList)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Категория не активна')
      }

      updateData(service, { name, price, category })
      await service.save()

      const serviceCategory = await Category.findById(service.category)
      const result = {
        ...service._doc,
        category: serviceCategory.name
      }

      return res.json({ message: 'Услуга успешно обновлена', service: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const hospital = await Hospital.findOne({ user: req.user._id })
      const service = await Service.findById(id)

      if(!service) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      if(hospital._id.toString() !== service.hospital.toString()) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const appointmentsCount = await Appointment.countDocuments({ service: id })

      if(appointmentsCount) {
        service.deleted = true
        await service.save()
      } else {
        await service.deleteOne()
      }

      return res.json({ message: 'Услуга успешно удалена' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()