import React from 'react'

import Layout from 'antd/lib/layout'

import Header from '../components/Header'
import Head from '../components/Head'

const MainLayout: React.FC = ({ children }) => {
  return (
    <>
      <Head />
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