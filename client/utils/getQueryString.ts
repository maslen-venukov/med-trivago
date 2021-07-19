const getQueryString = (values: any): string => {
  const entries = Object.entries(values)

  const str = entries.reduce((acc, [key, value]) => (
    acc += `${key}=${value}&`
  ), '')

  const query = str.slice(0, -1)
  return query ? `?${query}` : ''
}

export default getQueryString