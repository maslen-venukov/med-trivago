import mongoose from 'mongoose'

const config: mongoose.ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

const connectDB = url => mongoose.connect(url, config).then(() => console.log('MongoDB connected'))

export default connectDB