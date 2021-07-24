import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import SearchOutlined from '@ant-design/icons/SearchOutlined'

import { setQuery } from '../../store/actions/search'

import pushQueryToUrl from '../../utils/pushQueryToUrl'

import { RootState } from '../../store/reducers'

interface ISearchProps {
  className?: string
}

const Search: React.FC<ISearchProps> = ({ className }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [form] = Form.useForm()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const onSearch = () => {
    router.pathname === '/'
      ? router.push(`/search${q ? `?q=${q}` : ''}`)
      : pushQueryToUrl(router, { q, ...filters, ...sort })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value))
  }

  useEffect(() => {
    const { q } = router.query
    if(q && typeof q === 'string') {
      dispatch(setQuery(q))
    }
  }, [dispatch])

  useEffect(() => {
    form.setFieldsValue({ q })
  }, [q])

  return (
    <div className={`search ${className || ''}`}>
      <Form onFinish={onSearch} layout="inline" form={form}>
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
  )
}

export default Search