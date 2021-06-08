import { model, Schema, Document } from 'mongoose'

export interface ICategory {
  _id?: string
  name: string
}

const schema = new Schema({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true
})

export default model<ICategory & Document>('Categories', schema)