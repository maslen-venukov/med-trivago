import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import List from 'antd/lib/list'
import Select from 'antd/lib/select'

import SearchLayout from '../layouts/SearchLayout'

import Service from '../components/Service'

import { setSort } from '../store/actions/search'

import pushQueryToUrl from '../utils/pushQueryToUrl'

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

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const onChange = (value: Sort) => {
    const p = value
    const data = { q, ...filters, ...sort, p }
    pushQueryToUrl(router, data)
    dispatch(setSort({ ...sort, p }))
  }

  // TODO разобраться с typescipt
  useEffect(() => {
    const p = router.query.p || ''
    dispatch(setSort({ ...sort, p }))
  }, [])

  return (
    <SearchLayout categories={categories} error={error}>
      <div className="sort">
        <Select defaultValue="" value={sort.p} onChange={onChange}>
          <Select.Option value="">По умолчанию</Select.Option>
          <Select.Option value="asc">Дешевле</Select.Option>
          <Select.Option value="desc">Дороже</Select.Option>
        </Select>
      </div>
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