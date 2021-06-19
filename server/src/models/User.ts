import { Request } from 'express'
import { model, Schema, Document } from 'mongoose'

export interface IUserRequest extends Request {
  user: {
    _id: string
    email: string
    role: string
  }
}

export interface IUser {
  _id?: string
  email: string
  password: string
  role: string
}

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'USER' }
}, {
  timestamps: true
})

export default model<IUser & Document>('Users', schema)