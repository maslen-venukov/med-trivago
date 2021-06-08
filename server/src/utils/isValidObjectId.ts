import mongoose from 'mongoose'

const isValidObjectId = mongoose.Types.ObjectId.isValid

export default isValidObjectId