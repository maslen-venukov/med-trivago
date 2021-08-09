import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Result from 'antd/lib/result'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Pagination from 'antd/lib/pagination'

import SearchLayout from '../layouts/SearchLayout'

import Searched from '../components/services/Searched'

import { setFilters, setQuery, setSort } from '../store/actions/search'
import { setMobile } from '../store/actions/sidebar'

import { getSearchResult } from '../api'

import pushQueryToUrl from '../utils/pushQueryToUrl'

import { ICategory } from '../types/categories'
import { RootState } from '../store/reducers'
import { ISearchResult, Sort } from '../types/search'

interface ISearchProps {
  categories: ICategory[]
  searched: ISearchResult[]
  total: number
  pageSize: number
  error?: string
}

const Search: React.FC<ISearchProps> = ({ categories, searched, total, pageSize, error }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const getTitle = () => {
    const { q } = router.query
    return typeof q === 'string' ? q : ''
  }

  const onMobileChange = () => dispatch(setMobile(window.innerWidth <= 575))

  const onPageChange = (page: number) => {
    pushQueryToUrl(router, { q, ...filters, ...sort, page: page === 1 ? undefined : page })
  }

  useEffect(() => {
    const p = (router.query.p || '') as Sort
    dispatch(setSort({ ...sort, p }))

    if(typeof window !== 'undefined') {
      onMobileChange()
      window.addEventListener('resize', onMobileChange)
    }

    return () => {
      dispatch(setQuery(''))
      dispatch(setFilters({ cat: '', city: '', minp: '', maxp: '' }))
      dispatch(setSort({ p: '' }))
      typeof window !== 'undefined' && window.removeEventListener('resize', onMobileChange)
    }
  }, [dispatch])

  return (
    <SearchLayout
      categories={categories}
      error={error}
      title={getTitle()}
      keywords={[getTitle()]}
    >
      {searched?.length ? <>
        <Row gutter={[16, 16]}>
          {searched.map(service => (
            <Col key={service.name} md={8} sm={12} xs={24}>
              <Searched categories={categories} {...service} />
            </Col>
          ))}
        </Row>
        {total > pageSize && (
          <Pagination
            current={Number(router.query.page) || 1}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            className="search-pagination"
          />
        )}
      </> : (
        <Result
          status="404"
          title="Услуги не найдены"
          subTitle="Попробуйте изменить параметры поиска"
        />
      )}
    </SearchLayout>
  )
}

export default Search

export const getServerSideProps: GetServerSideProps = getSearchResult