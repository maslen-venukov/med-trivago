import { model, Schema, Document, Types } from 'mongoose'

const { ObjectId } = Types

export interface IAppointment {
  _doc?: IAppointment
  _id?: string
  name: string
  phone: string
  date: Date
  service: string
}

const schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  service: { type: ObjectId, ref: 'Services', required: true }
}, {
  timestamps: true
})

export default model<IAppointment & Document>('Appointments', schema)