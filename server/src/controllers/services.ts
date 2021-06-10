import { Request, Response } from 'express'

import Hospital, { IServiceList, IService } from '../models/Hospital'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'

class Controller {
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const hospitals = await Hospital.find()
      const serviceLists: IServiceList[] = hospitals.map(hospital => hospital.serviceList).flat()
      let services: IService[] = serviceLists.map(serviceList => serviceList.list).flat()

      const { q, minp, maxp, p } = req.query

      if(q && typeof q === 'string') {
        services = services.filter(service => service.name.toLowerCase().includes(q.toLowerCase()))
      }

      if(minp) {
        services = services.filter(service => service.price >= Number(minp))
      }

      if(maxp) {
        services = services.filter(service => service.price <= Number(maxp))
      }

      if(p === 'desc') {
        services = services.sort((a, b) => a.price < b.price ? 1 : -1)
      }

      if(p === 'asc') {
        services = services.sort((a, b) => a.price > b.price ? 1 : -1)
      }

      return res.json({ services })
    } catch (e) {
      console.log(e)
      createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()