import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import BackTop from 'antd/lib/back-top'

import Search from '../components/search/Search'
import Head from '../components/app/Head'
import Filters from '../components/search/Filters'
import SortSelect from '../components/search/SortSelect'
import CategoriesFilter from '../components/search/CategoriesFilter'
import Header from '../components/app/Header'

import { setFilters, setSort } from '../store/actions/search'

import pushQueryToUrl from '../utils/pushQueryToUrl'

import { IFilters, ISort, SearchAction, Sort } from '../types/search'
import { ICategory } from '../types/categories'
import { RootState } from '../store/reducers'

interface ISearchLayoutProps {
  categories: ICategory[]
  error: string
  title: string
  keywords: string[]
}

const SearchLayout: React.FC<ISearchLayoutProps> = ({ children, categories, error, title, keywords }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const onDataChange = (newData: ISort | IFilters, setState: (payload: any) => SearchAction) => {
    const data = { q, ...filters, ...sort, ...newData }
    pushQueryToUrl(router, data)
    dispatch(setState({ ...newData }))
  }

  const onSortChange = (p: Sort) => onDataChange({ p }, setSort)

  const onCategoryChange = (e: React.MouseEvent<HTMLSpanElement>) => {
    const cat = e.currentTarget.textContent || ''
    onDataChange({ ...filters, cat }, setFilters)
  }

  const onResetCategory = () => onDataChange({ ...filters, cat: '' }, setFilters)

  return (
    <>
      <BackTop />
      <Head title={title} keywords={keywords} />
      <Layout hasSider={false} className="layout container">
        {/* <Header /> */}
        <Layout.Content>
          <Row gutter={16} className="search-row">
            <Col flex="1">
              <Search />
              <CategoriesFilter
                categories={categories}
                error={error}
                onChange={onCategoryChange}
                onReset={onResetCategory}
              />
              {children}
            </Col>
            <Col flex="160px">
              <SortSelect value={sort.p} onChange={onSortChange} />
              <Filters />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </>
  )
}

export default SearchLayout