const updateData = (document: object, data: object) => {
  Object.keys(data).forEach(key => {
    const value = data[key]
    if(value) {
      document[key] = value
    }
  })
}

export default updateData