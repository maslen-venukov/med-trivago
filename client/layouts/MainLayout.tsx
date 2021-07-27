import React from 'react'

import Layout from 'antd/lib/layout'

import Head from '../components/app/Head'
import Header from '../components/app/Header'
import Footer from '../components/app/Footer'

interface IMainLayoutProps {
  title?: string
  keywords?: string[]
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children, title, keywords }) => {
  return (
    <>
      <Head title={title} keywords={keywords} />
      <Layout className="layout layout--main container">
        <Header />
        <Layout.Content>
          {children}
        </Layout.Content>
        <Footer />
      </Layout>
    </>
  )
}

export default MainLayout