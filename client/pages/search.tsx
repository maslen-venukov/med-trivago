import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import List from 'antd/lib/list'

import SearchLayout from '../layouts/SearchLayout'

import Service from '../components/services/Service'

import { setSort } from '../store/actions/search'

import { ICategory } from '../types/categories'
import { IService } from '../types/services'
import { RootState } from '../store/reducers'
import { Sort } from '../types/search'

interface ISearchProps {
  categories: ICategory[]
  services: IService[]
  error: string
}

const Search: React.FC<ISearchProps> = ({ categories, services, error }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { sort } = useSelector((state: RootState) => state.search)

  const getTitle = () => {
    const { q } = router.query
    return typeof q === 'string' ? q : ''
  }

  useEffect(() => {
    const p = (router.query.p || '') as Sort
    dispatch(setSort({ ...sort, p }))
  }, [dispatch])

  return (
    <SearchLayout
      categories={categories}
      error={error}
      title={getTitle()}
      keywords={[getTitle()]}
    >
      <List
        className="services"
        bordered
        dataSource={services}
        renderItem={(service: IService) => <Service {...service} />}
      />
    </SearchLayout>
  )
}

export default Search

export const getServerSideProps: GetServerSideProps  = async context => {
  try {
    const res = await axios.all([
      axios.get('/api/categories'),
      axios.get('/api/services', { params: context.query })
    ])

    const { categories } = res[0].data
    const { services } = res[1].data

    return {
      props: {
        categories,
        services
      }
    }
  } catch {
    return {
      props: {
        error: 'Ошибка при загрузке данных'
      }
    }
  }
}