import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import message from 'antd/lib/message'

import MainLayout from './MainLayout'

import Loading from '../components/Loading'
import NotFound from '../components/NotFound'

import { RootState } from '../store/reducers'
import { Roles } from '../types'

interface ILink {
  label: string
  route: string
  role?: string
}

const ProfileLayout: React.FC = ({ children }) => {
  const router = useRouter()

  const { user, ready } = useSelector((state: RootState) => state.user)

  const [rights, setRights] = useState<boolean>(false)

  const links: ILink[] = [
    { label: 'Главная', route: '/' },
    { label: 'Список исполнителей', route: '/profile/executors', role: Roles.Admin },
    { label: 'Добавить исполнителя', route: '/profile/invite', role: Roles.Admin }
  ]

  const linksToRender = links
    .filter(link => link.role === user?.role || !link.role)
    .map(link => (
      <Menu.Item key={link.route}>
        <Link href={link.route}>
          <a>{link.label}</a>
        </Link>
      </Menu.Item>
    ))

  useEffect(() => {
    if(ready && !user) {
      router.push('/login')
      message.warning('Пожалуйста авторизуйтесь')
    }
  }, [ready, user, router])

  useEffect(() => {
    const link = links.find(link => link.route === router.pathname)
    const rights = link ? link.role === user?.role : true
    setRights(rights)
  }, [router, user])

  return ready && user ? (
    rights ? (
      <Layout className="layout">
        <Layout.Sider width={250} style={{ backgroundColor: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[router.pathname]}
            style={{ height: '100%' }}
          >
            {linksToRender}
          </Menu>
        </Layout.Sider>
        <Layout.Content className="profile container">
          {children}
        </Layout.Content>
      </Layout>
    ) : (
      <MainLayout>
        <NotFound />
      </MainLayout>
    )
  ) : <Loading />
}

export default ProfileLayout