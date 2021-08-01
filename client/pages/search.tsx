import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Masonry from 'react-masonry-css'

import Result from 'antd/lib/result'

import SearchLayout from '../layouts/SearchLayout'

import Searched from '../components/services/Searched'

import { setFilters, setQuery, setSort } from '../store/actions/search'
import { setMobile } from '../store/actions/sidebar'

import { ICategory } from '../types/categories'
import { RootState } from '../store/reducers'
import { ISearchResult, Sort } from '../types/search'

interface ISearchProps {
  categories: ICategory[]
  searched: ISearchResult[]
  error: string
}

const Search: React.FC<ISearchProps> = ({ categories, searched, error }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { sort } = useSelector((state: RootState) => state.search)

  const getTitle = () => {
    const { q } = router.query
    return typeof q === 'string' ? q : ''
  }

  const changeMobile = () => dispatch(setMobile(window.innerWidth <= 575))

  useEffect(() => {
    const p = (router.query.p || '') as Sort
    dispatch(setSort({ ...sort, p }))

    if(typeof window !== 'undefined') {
      changeMobile()
      window.addEventListener('resize', changeMobile)
    }

    return () => {
      dispatch(setQuery(''))
      dispatch(setFilters({ cat: '', city: '', minp: '', maxp: '' }))
      dispatch(setSort({ p: '' }))
      typeof window !== 'undefined' && window.removeEventListener('resize', changeMobile)
    }
  }, [dispatch])

  return (
    <SearchLayout
      categories={categories}
      error={error}
      title={getTitle()}
      keywords={[getTitle()]}
    >
      {searched.length ? (
        <Masonry
          breakpointCols={{
            default: 3,
            768: 2,
            425: 1
          }}
          className="services-grid"
          columnClassName="services-grid__column"
        >
          {searched.map(service => <Searched {...service} key={service.name} categories={categories} />)}
        </Masonry>
      ) : (
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

export const getServerSideProps: GetServerSideProps  = async context => {
  try {
    const res = await axios.all([
      axios.get('/api/categories'),
      axios.get('/api/services', { params: context.query })
    ])

    return {
      props: {
        categories: res[0].data.categories,
        searched: res[1].data.searched
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