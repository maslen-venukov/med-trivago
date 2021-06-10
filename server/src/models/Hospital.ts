import { model, Schema, Document, Types } from 'mongoose'

const { ObjectId } = Types

interface IWorkingHours {
  start: string
  end: string
}

interface IServiceList {
  _id?: string
  category: string
  workingHours: IWorkingHours
}

interface IHospital {
  _id?: string
  name: string
  address: string
  workingHours: IWorkingHours
  phone: string
  serviceList: IServiceList[]
  account: string
}

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  phone: { type: String, required: true, unique: true },
  serviceList: [{
    category: { type: ObjectId, ref: 'Categories', required: true },
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true }
    }
  }],
  account: { type: ObjectId, ref: 'Accounts', required: true, unique: true }
}, {
  timestamps: true
})

export default model<IHospital & Document>('Hospitals', schema)