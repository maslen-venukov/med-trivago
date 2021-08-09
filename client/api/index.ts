import { GetServerSidePropsContext } from 'next'
import axios from 'axios'
import queryStringify from 'qs-stringify'

const error = {
  props: {
    error: 'Ошибка при загрузке данных'
  }
}

export const getIndexPageData = async () => {
  try {
    const res = await axios.all([
      axios.get('/api/categories'),
      axios.get('/api/stats/count')
    ])

    return {
      props: {
        categories: res[0].data.categories,
        stats: res[1].data
      }
    }
  } catch {
    return error
  }
}

export const getSearchResult = async (context: GetServerSidePropsContext) => {
  try {
    const res = await axios.all([
      axios.get('/api/categories'),
      axios.get('/api/services', { params: context.query })
    ])

    const { searched, total, pageSize } = res[1].data

    return {
      props: {
        categories: res[0].data.categories,
        searched,
        total,
        pageSize
      }
    }
  } catch {
    return error
  }
}

export const getCompareResult = async (context: GetServerSidePropsContext) => {
  try {
    const serviceName = queryStringify({ serviceName: context.params?.serviceName?.toString() }).replace('serviceName=', '')
    const query = { ...context.query } as { [name: string]: string }
    delete query.serviceName
    const res = await axios.get(`/api/services/compare/${serviceName}?${queryStringify(query)}`)

    return {
      props: {
        compared: res.data.compared
      }
    }
  } catch {
    return error
  }
}

export const getRegisterLink = async (context: GetServerSidePropsContext) => {
  try {
    const res = await axios.get(`/api/register-links/${context.query.link}`)
    return {
      props: {
        link: res.data.link
      }
    }
  } catch {
    return {
      props: {
        link: null
      }
    }
  }
}

export const getServiceData = async (context: GetServerSidePropsContext) => {
  try {
    const res = await axios.get(`/api/services/${context.query.id}`)
    return {
      props: {
        ...res.data.service
      }
    }
  } catch (e) {
    return error
  }
}