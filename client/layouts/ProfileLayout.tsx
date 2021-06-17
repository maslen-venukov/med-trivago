import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'

import Loading from '../components/Loading'

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

  const links: ILink[] = [
    { label: 'Главная', route: '/' },
    { label: 'Список исполнителей', route: '/profile/executors', role: Roles.Admin },
    { label: 'Добавить исполнителя', route: '/profile/invite', role: Roles.Admin }
  ]

  useEffect(() => {
    ready && !user && router.push('/login')
  }, [ready, user, router])

  return ready && user ? (
    <Layout className="layout">
      <Layout.Sider width={250} style={{ backgroundColor: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[router.pathname]}
          style={{ height: '100%' }}
        >
          {links
            .filter(link => link.role === user?.role || !link.role)
            .map(link => (
              <Menu.Item key={link.route}>
                <Link href={link.route}>
                  <a>{link.label}</a>
                </Link>
              </Menu.Item>
            ))}
        </Menu>
      </Layout.Sider>
      <Layout.Content className="profile container">
        {children}
      </Layout.Content>
    </Layout>
  ) : <Loading />
}

export default ProfileLayout
