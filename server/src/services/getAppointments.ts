import { FilterQuery, Document } from 'mongoose'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'
import Appointment, { IAppointment } from '../models/Appointment'

import getUniqueIds from '../utils/getUniqueIds'

const getAppointments = async (req: IUserRequest, filter: FilterQuery<IAppointment & Document> = {}) => {
  const hospital = await Hospital.findOne({ user: req.user._id })

  const services = await Service.find({ hospital: hospital._id })
  const servicesIds = getUniqueIds(services)

  const appointments = await Appointment.find({ service: { $in: servicesIds }, deleted: false, ...filter }).sort({ date: -1 })

  const result = appointments.map(appointment => {
    const service = services.find(service => service._id.toString() === appointment.service.toString())
    return { ...appointment._doc, service }
  })

  return result
}

export default getAppointments