const getQueryString = (values: any): string => {
  const keys = Object.keys(values)

  const str = keys.reduce((acc, key) => {
    const value = values[key]
    return acc += `${key}=${value}&`
  }, '')

  const query = str.slice(0, -1)

  if(!query) {
    return ''
  }

  return '?' + query
}

export default getQueryString