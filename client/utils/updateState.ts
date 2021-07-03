const updateState = <T extends { _id: string }>(document: T, payload: T) => {
  return document._id === payload._id ? payload : document
}

export default updateState