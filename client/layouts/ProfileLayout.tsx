import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import Button from 'antd/lib/button'
import Badge from 'antd/lib/badge'
import message from 'antd/lib/message'

import MainLayout from './MainLayout'

import Loading from '../components/Loading'
import NotFound from '../components/NotFound'
import Head from '../components/Head'

import { logout } from '../store/actions/user'

import { RootState } from '../store/reducers'
import { Roles } from '../types'
import { resetNotifications } from '../store/actions/socket'

interface ILink {
  label: string
  route: string
  role?: string
  notifications?: number
}

interface IProfileLayoutProps {
  title?: string
  className?: string
}

const ProfileLayout: React.FC<IProfileLayoutProps> = ({ children, title, className }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { user, ready, loggedOut } = useSelector((state: RootState) => state.user)
  const { notifications } = useSelector((state: RootState) => state.socket)

  const [rights, setRights] = useState<boolean>(false)

  const links: ILink[] = [
    { label: 'Главная', route: '/' },
    { label: 'Список исполнителей', route: '/profile/executors', role: Roles.Admin },
    { label: 'Добавить исполнителя', route: '/profile/invite', role: Roles.Admin },
    { label: 'Услуги', route: '/profile/services', role: Roles.Hospital },
    { label: 'Запись', route: '/profile/appointment', role: Roles.Hospital, notifications }
  ]

  const onLogout = () => dispatch(logout(router))

  const onLinkClick = (notifications?: number) => notifications && dispatch(resetNotifications())

  const linksToRender = links
    .filter(link => link.role === user?.role || !link.role)
    .map(link => (
      <Menu.Item key={link.route}>
        <Link href={link.route}>
          <a onClick={() => onLinkClick(link.notifications)}>
            <Badge count={link.notifications} size="small" offset={[8, 0]}>
              {link.label}
            </Badge>
          </a>
        </Link>
      </Menu.Item>
    ))

  useEffect(() => {
    if(ready && !user && !loggedOut) {
      router.push('/login')
      message.warning('Пожалуйста авторизуйтесь')
    }
  }, [ready, user, loggedOut, router])

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
        <Layout>
          <Layout.Header className="profile__header">
            <div className="container profile__container">
              <Button onClick={onLogout} danger type="primary" className="profile__logout">
                Выйти
              </Button>
            </div>
          </Layout.Header>
          <Layout.Content className={`container profile__container profile__content ${className}`}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    ) : (
      <MainLayout>
        <NotFound />
      </MainLayout>
    )
  ) : <Loading />
}

export default ProfileLayout