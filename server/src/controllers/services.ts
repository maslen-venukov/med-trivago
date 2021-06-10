import { Request, Response } from 'express'

import Service from '../models/Service'
import Category from '../models/Category'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

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

      const services = await Service.find(find).sort(sort)

      return res.json({ services })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()