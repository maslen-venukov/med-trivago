const getUniqueIds = (arr: {}[], fieldName = '_id') => {
  return [...new Set(arr.map(el => el[fieldName].toString()))]
}

export default getUniqueIds