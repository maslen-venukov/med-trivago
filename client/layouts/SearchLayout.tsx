import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Row from 'antd/lib/row'
import Tag from 'antd/lib/tag'
import Col from 'antd/lib/col'
import CloseOutlined from '@ant-design/icons/CloseOutlined'

import Header from '../components/Header'
import Head from '../components/Head'
import Filters from '../components/search/Filters'
import SortComponent from '../components/search/Sort'

import { setFilters, setSort } from '../store/actions/search'

import pushQueryToUrl from '../utils/pushQueryToUrl'

import { IFilters, ISort, SearchAction, Sort } from '../types/search'
import { ICategory } from '../types/categories'
import { RootState } from '../store/reducers'
import { Colors } from '../types'

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
      <Head title={title} keywords={keywords} />
      <Layout className="layout">
        <Header />
        <Layout className="layout">
          <div className="container">
            <Row justify="space-between" align="middle" className="search-header">
              <Col flex="1">
                {categories.map(category => (
                  <Tag
                    key={category._id}
                    color={filters.cat === category.name ? Colors.Green : Colors.Accent}
                    onClick={onCategoryChange}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </Tag>
                ))}
                <Tag
                  icon={<CloseOutlined />}
                  onClick={onResetCategory}
                  className="cursor-pointer"
                >
                  Сбросить
                </Tag>
              </Col>
              <Col flex="160px">
                <SortComponent value={sort.p} onChange={onSortChange} />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col>
                <Filters categories={categories} error={error} />
              </Col>
              <Col flex="1">
                <Layout.Content>
                  {children}
                </Layout.Content>
              </Col>
            </Row>
          </div>
        </Layout>
      </Layout>
    </>
  )
}

export default SearchLayout