import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import List from 'antd/lib/list'
import Select from 'antd/lib/select'

import SearchLayout from '../layouts/SearchLayout'

import { setSort } from '../store/actions/search'

import { ICategory } from '../types/categories'
import { IService } from '../types/services'
import pushQueryToUrl from '../utils/pushQueryToUrl'

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

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const onSortChange = (value: Sort) => {
    dispatch(setSort({ ...sort, p: value }))
  }

  useEffect(() => {
    const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, data)
  }, [sort])

  useEffect(() => {
    pushQueryToUrl(router, router.query)
  }, [])

  return (
    <SearchLayout categories={categories} error={error}>
      <div className="sort">
        <Select defaultValue="" onChange={onSortChange}>
          <Select.Option value="">По умолчанию</Select.Option>
          <Select.Option value="asc">Дешевле</Select.Option>
          <Select.Option value="desc">Дороже</Select.Option>
        </Select>
      </div>
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

export const getServerSideProps: GetServerSideProps  = async (context) => {
  try {
    const categories = await axios.get('/api/categories')
    const services = await axios.get('/api/services', { params: context.query })
    return {
      props: {
        categories: categories.data.categories,
        services: services.data.services
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