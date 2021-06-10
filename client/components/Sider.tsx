import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'antd/lib/layout'
import Form from 'antd/lib/form'
import AutoComplete from 'antd/lib/auto-complete'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Button from 'antd/lib/button'

import { setFilters } from '../store/actions/search'

import pushQueryToUrl from '../utils/pushQueryToUrl'

import { ICategory } from '../types/categories'
import { RootState } from '../store/reducers'

interface ISiderProps {
  categories: ICategory[]
  error: string
}

interface ISiderFormValues {
  cat: string
  minp: string
  maxp: string
}

const Sider: React.FC<ISiderProps> = ({ categories, error }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const [mounted, setMounted] = useState<boolean>(false)

  const onShow = (values: ISiderFormValues) => {
    dispatch(setFilters({ ...values }))
  }

  useEffect(() => {
    const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, data)
  }, [filters])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Layout.Sider className="sider">
      <Form onFinish={onShow} layout="vertical">
        <Form.Item label="Категория" name="cat">
          {!error ? (
            <AutoComplete
              options={categories.map(category => ({ value: category.name }))}
              placeholder="Категория"
              allowClear
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          ) : (
            <Input placeholder="Категория" allowClear />
          )}
        </Form.Item>


        {mounted && (
          <Form.Item label="Цена">
            <Input.Group compact>
              <Form.Item name="minp">
                <InputNumber placeholder="Цена от" min="0" />
              </Form.Item>
              <Form.Item name="maxp">
                <InputNumber placeholder="до" min="0" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">Показать</Button>
        </Form.Item>
      </Form>
    </Layout.Sider>
  )
}

export default Sider