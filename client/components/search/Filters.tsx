import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Button from 'antd/lib/button'

import { setFilters } from '../../store/actions/search'

import useLazyInput from '../../hooks/useLazyInput'

import pushQueryToUrl from '../../utils/pushQueryToUrl'

import { RootState } from '../../store/reducers'
import { IFilters } from '../../types/search'

const Filters: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const [mounted, setMounted] = useState<boolean>(false)
  const lazy = useLazyInput()

  const { cat, minp, maxp } = router.query

  const onShow = () => {
    const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, data)
  }

  const onChange = (value: string | number, fieldName: string) => {
    const newFilters = { ...filters, [fieldName]: value }
    const setState = () => dispatch(setFilters(newFilters))
    lazy(setState)
  }

  useEffect(() => {
    const filters = { cat, minp, maxp } as IFilters
    dispatch(setFilters(filters))
  }, [dispatch])

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? (
    <Layout.Sider className="filters">
      <Form onFinish={onShow} layout="vertical" initialValues={{
        minp: minp || '',
        maxp: maxp || ''
      }}>
        <Form.Item label="Цена">
          <Input.Group compact>
            <Form.Item name="minp">
              <InputNumber
                placeholder="Цена от"
                min="0"
                value={filters.minp}
                onChange={value => onChange(value, 'minp')}
              />
            </Form.Item>

            <Form.Item name="maxp">
              <InputNumber
                placeholder="до"
                min="0"
                value={filters.maxp}
                onChange={value => onChange(value, 'maxp')}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Показать</Button>
        </Form.Item>
      </Form>
    </Layout.Sider>
  ) : null
}

export default Filters