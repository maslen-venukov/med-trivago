import { NextRouter } from 'next/router'

import getQueryString from './getQueryString'

const pushQueryToUrl = (router: NextRouter, data: any) => {
  router.query = {}

  Object.keys(data).forEach(key => {
    const value = data[key]
    if(value) {
      router.query[key] = value
    }
  })

  const query = getQueryString(router.query)

  router.push('/search' + query)
}

export default pushQueryToUrl