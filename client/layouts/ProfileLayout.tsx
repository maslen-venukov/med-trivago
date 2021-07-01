import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import Button from 'antd/lib/button'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import message from 'antd/lib/message'

import MainLayout from './MainLayout'

import Loading from '../components/app/Loading'
import NotFound from '../components/app/NotFound'
import Head from '../components/app/Head'

import { logout } from '../store/actions/user'

import { RootState } from '../store/reducers'
import { Roles } from '../types'

interface ILink {
  label: string
  href: string
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
  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { notifications } = useSelector((state: RootState) => state.socket)

  const [rights, setRights] = useState<boolean>(false)

  const links: ILink[] = [
    { label: 'Главная', href: '/' },
    { label: 'Список исполнителей', href: '/profile/executors', role: Roles.Admin },
    { label: 'Добавить исполнителя', href: '/profile/invite', role: Roles.Admin },
    { label: 'Категории', href: '/profile/categories', role: Roles.Admin },
    { label: 'Информация', href: '/profile/info', role: Roles.Hospital },
    { label: 'Активные категории', href: '/profile/active-categories', role: Roles.Hospital },
    { label: 'Услуги', href: '/profile/services', role: Roles.Hospital },
    { label: 'Запись', href: '/profile/appointment', role: Roles.Hospital, notifications }
  ]

  const onLogout = () => dispatch(logout(router))

  const linksToRender = links
    .filter(link => link.role === user?.role || !link.role)
    .map(link => (
      <Menu.Item key={link.href}>
        <Link href={link.href}>
          <a>{link.label} {link.notifications ? `(${link.notifications})` : ''}</a>
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
    const link = links.find(link => link.href === router.pathname)
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
              <Row justify="space-between" align="middle">
                <Col>
                  {user.role === Roles.Hospital && (
                    <Link href="/profile/info">
                      <a>{currentHospital?.name}</a>
                    </Link>
                  )}
                  {user.role === Roles.Admin && (
                    <Typography.Link>Панель администратора</Typography.Link>
                  )}
                </Col>
                <Col>
                  <Button onClick={onLogout} danger type="primary">
                    Выйти
                  </Button>
                </Col>
              </Row>
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