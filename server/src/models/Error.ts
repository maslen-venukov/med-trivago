import { model, Schema, Document } from 'mongoose'

export interface IError {
  _id?: string
  message: string
}

const schema = new Schema({
  message: { type: String, required: true }
}, {
  timestamps: true
})

export default model<IError & Document>('Errors', schema)