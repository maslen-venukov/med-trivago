const getUniqueIds = (arr: object[], fieldName = '_id'): string[] => {
  return [...new Set(arr.map(el => el[fieldName].toString()))]
}

export default getUniqueIds