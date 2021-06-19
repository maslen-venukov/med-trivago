import { model, Schema, Document } from 'mongoose'

export interface IRegisterLink {
  _id?: string
  link: string
  email: string
}

const schema = new Schema({
  link: { type: String, required: true },
  email: { type: String, required: true }
}, {
  timestamps: true
})

export default model<IRegisterLink & Document>('Register_Links', schema)