import React from 'react'

import Layout from 'antd/lib/layout'

import Header from '../components/Header'
import Head from '../components/Head'
import Filters from '../components/Filters'

import { ICategory } from '../types/categories'

interface ISearchLayoutProps {
  categories: ICategory[]
  error: string
  title: string
}

const SearchLayout: React.FC<ISearchLayoutProps> = ({ children, categories, error, title }) => {
  return (
    <>
      <Head title={title} />
      <Layout className="layout">
        <Header />
        <Layout className="layout container">
          <Filters categories={categories} error={error} />
          <Layout.Content className="content">
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  )
}

export default SearchLayout