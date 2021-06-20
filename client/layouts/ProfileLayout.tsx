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
import Head from '../components/Head'

import { RootState } from '../store/reducers'
import { Roles } from '../types'

interface ILink {
  label: string
  route: string
  role?: string
}

interface IProfileLayoutProps {
  title?: string
  className?: string
}

const ProfileLayout: React.FC<IProfileLayoutProps> = ({ children, title, className }) => {
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
      <Layout className="profile">
        <Head title={`${title ? `${title} - ` : ''}Профиль`} />
        <Layout.Sider width={250}>
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[router.pathname]}
            className="profile__menu"
          >
            {linksToRender}
          </Menu>
        </Layout.Sider>
        <Layout.Content className={`container profile__container ${className}`}>
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