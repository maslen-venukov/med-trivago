const updateData = (document: object, data: object) => {
  Object.entries(data).forEach(([key, value]) => {
    if(value) {
      document[key] = value
    }
  })
}

export default updateData