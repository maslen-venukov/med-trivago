import React from 'react'

import Layout from 'antd/lib/layout'

import Search from '../components/search/Search'
import Head from '../components/app/Head'

interface IMainLayoutProps {
  title?: string
  keywords?: string[]
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children, title, keywords }) => {
  const phone = '8 (905) 840-44-04'
  const email = 'ooomk_nv@mail.ru'

  return (
    <>
      <Head title={title} keywords={keywords} />
      <Layout className="layout container">
        {/* <Header /> */}
        <Layout.Content>
          <Search />
          {children}
        </Layout.Content>
      </Layout>
    </>
  )
}

export default MainLayout