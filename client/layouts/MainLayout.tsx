import React from 'react'

import Layout from 'antd/lib/layout'

import Search from '../components/search/Search'
import Head from '../components/app/Head'

interface IMainLayoutProps {
  title?: string
  keywords?: string[]
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children, title, keywords }) => {
  return (
    <>
      <Head title={title} keywords={keywords} />
      <Layout className="layout container">
        <Layout.Content>
          <Search />
          {children}
        </Layout.Content>
      </Layout>
    </>
  )
}

export default MainLayout