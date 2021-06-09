import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import SearchOutlined from '@ant-design/icons/SearchOutlined'

import { setQuery } from '../store/actions/search'

import pushQueryToUrl from '../utils/pushQueryToUrl'

import { RootState } from '../store/reducers'

interface ISearchFormValues {
  q: string
}

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const onSearch = (values: ISearchFormValues) => {
    const query = values.q
    router.pathname === '/'
      ? router.push(`/search?q=${query || ''}`)
      : dispatch(setQuery(query))
  }

  useEffect(() => {
    const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, data)
  }, [q])

  return (
    <Layout.Header className="header">
      <div className="container">
        <div className="search">
          <Form onFinish={onSearch} layout="inline">
            <Form.Item name="q">
              <Input
                placeholder="Поиск по услугам"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Найти</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout.Header>
  )
}

export default Header