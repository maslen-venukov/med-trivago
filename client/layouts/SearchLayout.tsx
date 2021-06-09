import React from 'react'

import Layout from 'antd/lib/layout'

import Header from '../components/Header'
import Head from '../components/Head'
import Sider from '../components/Sider'

import { ICategory } from '../types/categories'

interface ISearchLayoutProps {
  categories: ICategory[]
  error: string
}

const SearchLayout: React.FC<ISearchLayoutProps> = ({ children, categories, error }) => {
  return (
    <>
      <Head />
      <Layout className="layout">
        <Header />
        <Layout className="layout container">
          <Sider categories={categories} error={error} />
          <Layout.Content className="content">
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  )
}

export default SearchLayout