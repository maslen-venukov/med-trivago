import React from 'react'

import Layout from 'antd/lib/layout'

import Header from '../components/search/Header'
import Head from '../components/app/Head'

interface IMainLayoutProps {
  title?: string
  keywords?: string[]
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children, title, keywords }) => {
  return (
    <>
      <Head title={title} keywords={keywords} />
      <Layout className="layout">
        <Header />
        <Layout.Content>
          <div className="container">
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </>
  )
}

export default MainLayout