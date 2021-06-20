import React from 'react'

import Layout from 'antd/lib/layout'

import Header from '../components/Header'
import Head from '../components/Head'

interface IMainLayoutProps {
  title?: string
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head title={title} />
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