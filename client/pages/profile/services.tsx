import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'
import Typography from 'antd/lib/typography'

import ProfileLayout from '../../layouts/ProfileLayout'

import { fetchHospitalServices } from '../../store/actions/services'

import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'

const Services: React.FC = () => {
  const dispatch = useDispatch()

  const { token } = useSelector((state: RootState) => state.user)
  const { services, loading } = useSelector((state: RootState) => state.services)

  useEffect(() => {
    token && dispatch(fetchHospitalServices(token))
  }, [dispatch, token])

  return (
    <ProfileLayout title="Услуги">
      <Table
        dataSource={services}
        loading={loading}
        rowKey={record => record._id}
      >
        <Column title="Название" dataIndex="name" key="name" />
        <Column title="Стоимость" dataIndex="price" key="price" render={(text: string) => `${text} ₽`} />
        <Column title="Категория" dataIndex="category" key="category" />
        <Column title="Дата создания" dataIndex="createdAt" key="createdAt" render={renderDate} />
        <Column
          title="Действия"
          key="action"
          render={() => (
            <Popconfirm
              title="Вы действительно хотите удалить услугу?"
              onConfirm={() => {}}
              okText="Да"
              cancelText="Нет"
            >
              <Typography.Text
                type="danger"
                className="cursor-pointer"
              >
                Удалить
              </Typography.Text>
            </Popconfirm>
          )}
        />
      </Table>
    </ProfileLayout>
  )
}

export default Services
