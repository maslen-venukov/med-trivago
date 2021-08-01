import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import BackTop from 'antd/lib/back-top'
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined'

import Head from '../components/app/Head'
import Header from '../components/app/Header'
import Footer from '../components/app/Footer'
import Search from '../components/search/Search'
import Filters from '../components/search/Filters'
import SortSelect from '../components/search/SortSelect'
import CategoriesFilter from '../components/search/CategoriesFilter'

import { setFilters, setQuery, setSort } from '../store/actions/search'
import { setVisible } from '../store/actions/sidebar'

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
  const sidebarRef = useRef(null)

  const { q, filters, sort } = useSelector((state: RootState) => state.search)
  const { mobile, visible } = useSelector((state: RootState) => state.sidebar)

  const onDataChange = (newData: ISort | IFilters, setState: (payload: any) => SearchAction) => {
    const data = { q, ...filters, ...sort, ...newData }
    pushQueryToUrl(router, data)
    dispatch(setState({ ...newData }))
  }

  const onSortChange = (p: Sort) => onDataChange({ p }, setSort)

  const onResetCategory = () => onDataChange({ ...filters, cat: '' }, setFilters)

  const onCategoryChange = (e: React.MouseEvent, selected: boolean) => {
    if(selected) {
      return onResetCategory()
    }
    const cat = e.currentTarget.textContent || ''
    const data = { ...filters, ...sort, cat, q: '' }
    pushQueryToUrl(router, data)
    dispatch(setFilters({ ...filters, cat }))
    dispatch(setQuery(''))
  }

  const onSidebarVisibleChange = () => dispatch(setVisible(!visible))

  return (
    <>
      <BackTop />
      <Head title={title} keywords={keywords} />
      <Layout hasSider={false} className="layout layout--search container">
        <Header />
        <Layout.Content>
          <Row gutter={16} className="search-row">
            <Search />
            <Col className="search-row__services">
              <CategoriesFilter
                categories={categories}
                error={error}
                onChange={onCategoryChange}
                onReset={onResetCategory}
              />
              {children}
            </Col>
            <Col
              ref={sidebarRef}
              className={`search-row__sidebar ${mobile && visible && 'search-row__sidebar--visible'}`}
            >
              {mobile && (
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  onClick={onSidebarVisibleChange}
                  className="search-row__back"
                >
                  Фильтры
                </Button>
              )}
              <SortSelect value={sort.p} onChange={onSortChange} />
              <Filters />
            </Col>
          </Row>
        </Layout.Content>
        <Footer />
      </Layout>
    </>
  )
}

export default SearchLayout