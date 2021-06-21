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
import lazyInput from '../utils/lazyInput'

import { RootState } from '../store/reducers'
import { ICategory } from '../types/categories'
import { IFilters } from '../types/search'

interface IFiltersProps {
  categories: ICategory[]
  error: string
}

const Filters: React.FC<IFiltersProps> = ({ categories, error }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { q, filters, sort } = useSelector((state: RootState) => state.search)

  const [mounted, setMounted] = useState<boolean>(false)
  const [timer, setTimer] = useState(0)

  const { cat, minp, maxp } = router.query

  const initialValues = {
    cat: cat || '',
    minp: minp || '',
    maxp: maxp || ''
  }

  const onShow = () => {
    const data = { q, ...filters, ...sort }
    pushQueryToUrl(router, data)
  }

  const onChange = (value: string | number, fieldName: string) => {
    lazyInput(timer, setTimer, () => {
      dispatch(setFilters({ ...filters, [fieldName]: value }))
    })
  }

  const onCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lazyInput(timer, setTimer, () => {
      dispatch(setFilters({ ...filters, cat: e.target.value }))
    })
  }

  useEffect(() => {
    const filters = { cat, minp, maxp } as IFilters
    dispatch(setFilters(filters))
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Layout.Sider className="sider">
      <Form onFinish={onShow} layout="vertical" initialValues={initialValues}>
        <Form.Item label="Категория" name="cat">
          {!error ? (
            <AutoComplete
              options={categories.map(category => ({ value: category.name }))}
              placeholder="Категория"
              allowClear
              filterOption={(inputValue, option) => {
                return option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }}
              value={filters.cat}
              onChange={value => onChange(value, 'cat')}
            />
          ) : (
            <Input
              placeholder="Категория"
              allowClear
              value={filters.cat}
              onChange={onCategoryInputChange}
            />
          )}
        </Form.Item>


        {mounted && (
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
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">Показать</Button>
        </Form.Item>
      </Form>
    </Layout.Sider>
  )
}

export default Filters