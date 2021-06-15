import React, { useState, useEffect } from 'react'
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

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const initialValues = {
    q: router.query.q || ''
  }

  const onSearch = () => {
    if(router.pathname === '/') {
      const url = `/search${q ? `?q=${q}` : ''}`
      router.push(url)
    } else {
      const data = { q, ...filters, ...sort }
      pushQueryToUrl(router, data)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value))
  }

  useEffect(() => {
    const { q } = router.query
    if(q && typeof q === 'string') {
      dispatch(setQuery(q))
    }
  }, [])

  return (
    <Layout.Header className="header">
      <div className="container">
        <div className="search">
          <Form onFinish={onSearch} layout="inline" initialValues={initialValues}>
            <Form.Item name="q">
              <Input
                placeholder="Поиск по услугам"
                prefix={<SearchOutlined />}
                allowClear
                value={q}
                onChange={onChange}
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