import React, { useState, useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'

import { setFilters } from '../../store/actions/search'

import useLazyInput from '../../hooks/useLazyInput'

import pushQueryToUrl from '../../utils/pushQueryToUrl'

import { RootState } from '../../store/reducers'
import { IFilters } from '../../types/search'

import cities from '../../data/cities.json'

const Filters: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const [mounted, setMounted] = useState<boolean>(false)
  const lazy = useLazyInput()

  const { cat, city, minp, maxp } = router.query
  const initialValues = {
    city: city || '',
    minp: minp || '',
    maxp: maxp || ''
  }

  const onShow = () => {
    const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, data)
  }

  const onChange = (value: string | number, fieldName: string, router?: NextRouter) => {
    const newFilters = { ...filters, [fieldName]: value }
    const setState = () => dispatch(setFilters(newFilters))
    lazy(setState)
    router && pushQueryToUrl(router, { q, ...sort, ...newFilters })
  }

  useEffect(() => {
    const filters = { cat, city, minp, maxp } as IFilters
    dispatch(setFilters(filters))
  }, [dispatch])

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? (
    <Layout.Sider className="filters">
      <Form
        onFinish={onShow}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item name="city" label="Город">
          <Select
            showSearch
            allowClear
            placeholder="Выберите город"
            optionFilterProp="children"
            onSelect={(value: string) => onChange(value, 'city', router)}
            onClear={() => onChange('', 'city', router)}
            filterOption={(input, option) => {
              const children = option?.children.props ? option.children.props.children : option?.children
              return children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}
          >
            <Select.Option value="" disabled>
              <span className="placeholder">Выберите город</span>
            </Select.Option>
            {cities.sort().map(city => (
              <Select.Option key={city} value={city}>{city}</Select.Option>
            ))}
          </Select>
        </Form.Item>

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