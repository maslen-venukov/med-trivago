import Error from '../models/Error'

const createError = async (e: ErrorEvent) => {
  const { message } = e
  await Error.create({ message })
}

export default createError