import { Request, Response } from 'express'

import Service, { IService } from '../models/Service'
import Category from '../models/Category'
import Hospital from '../models/Hospital'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import isValidObjectId from '../utils/isValidObjectId'

import { HTTPStatusCodes } from '../types'

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
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { q, cat, minp, maxp, p } = req.query

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
        if(value) return { ...acc, [key]: value }
        return acc
      }, {})

      const services: IService[] = await Service.find(find).sort(sort)

      const hospitalIds = [...new Set(services.map(service => service.hospital.toString()))]
      const hospitals = await Hospital.find({ _id: hospitalIds })

      const result = services.map(service => {
        const hospital = hospitals.find(hospital => hospital._id.toString() === service.hospital.toString())
        const { name, address, phone } = hospital
        return {
          ...service._doc,
          hospital: {
            name,
            address,
            phone
          }
        }
      })

      return res.json({ services: result })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      if(!isValidObjectId(id)) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Некорректный ID')
      }

      const service = await Service.findById(id)
      if(!service) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Услуга не найдена')
      }

      const category = await Category.findById(service.category)
      const hospital = await Hospital.findById(service.hospital)
      const schedule = hospital.serviceList.find(list => list.category.toString() === category._id.toString()).schedule

      const result = {
        ...service._doc,
        category: category.name,
        schedule,
        hospital: {
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          schedule: hospital.schedule
        }
      }

      return res.json({ service: result })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()