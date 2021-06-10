import Error from '../models/Error'

const createError = async e => {
  const { message } = e
  await Error.create({ message })
}

export default createError