import { model, Schema, Document, Types } from 'mongoose'

const { ObjectId } = Types

interface ISchedule {
  start: string
  end: string
}

interface IServiceList {
  _id?: string
  category: string
  schedule: {
    weekdays: ISchedule
    saturday?: ISchedule
    sunday?: ISchedule
  }
}

interface IHospital {
  _id?: string
  name: string
  address: string
  schedule: ISchedule
  phone: string
  serviceList: IServiceList[]
  user: string
}

const schedule = {
  start: { type: String, required: true },
  end: { type: String, required: true }
}

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  schedule: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  phone: { type: String, required: true, unique: true },
  serviceList: [{
    category: { type: ObjectId, ref: 'Categories', required: true },
    schedule: {
      weekdays: schedule,
      saturday: { type: schedule },
      sunday: { type: schedule }
    }
  }],
  user: { type: ObjectId, ref: 'Users', required: true, unique: true }
}, {
  timestamps: true
})

export default model<IHospital & Document>('Hospitals', schema)