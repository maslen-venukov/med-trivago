import React, { useEffect } from 'react'

import Layout from 'antd/lib/layout'
import message from 'antd/lib/message'

import Head from '../components/app/Head'
import Header from '../components/app/Header'
import Footer from '../components/app/Footer'

interface IMainLayoutProps {
  title?: string
  keywords?: string[]
  error?: string
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children, title, keywords, error }) => {
  useEffect(() => {
    error && message.error(error)
  }, [error])

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