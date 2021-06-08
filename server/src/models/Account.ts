import { Request } from 'express'
import { model, Schema, Document } from 'mongoose'

export interface IAccountRequest extends Request {
  account: {
    _id: string
    login: string
    role: string
  }
}

export interface IAccount {
  _id?: string
  login: string
  password: string
  role: string
}

const schema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'HOSPITAL' }
}, {
  timestamps: true
})

export default model<IAccount & Document>('Accounts', schema)