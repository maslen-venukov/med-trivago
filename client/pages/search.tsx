import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import axios from 'axios'

import List from 'antd/lib/list'

import SearchLayout from '../layouts/SearchLayout'

import { ICategory } from '../types/categories'
import { IService } from '../types/services'
import { RootState } from '../store/reducers'
import pushQueryToUrl from '../utils/pushQueryToUrl'

interface ISearchProps {
  categories: ICategory[]
  services: IService[]
  error: string
}

const Search: React.FC<ISearchProps> = ({ categories, services, error }) => {
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  useEffect(() => {
    // console.log(router.query)
    // const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, router.query)
  }, [])

  return (
    <SearchLayout categories={categories} error={error}>
      <List
        bordered
        dataSource={services}
        renderItem={(service: IService) => (
          <List.Item key={service._id}>
            {service.name} {service.price}
          </List.Item>
        )}
      />
    </SearchLayout>
  )
}

export default Search

export const getServerSideProps = async (context) => {
  try {
    const { q, cat, minp, maxp, p } = context.query
    const categories = await axios.get('/api/categories')
    const services = await axios.get('/api/services', {
      params: { q, cat, minp, maxp, p }
    })
    return {
      props: {
        categories: categories.data.categories,
        services: services.data.services
      }
    }
  } catch {
    return {
      props: {
        error: 'Ошибка при загрузке категорий'
      }
    }
  }
}