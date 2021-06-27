import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'
import Typography from 'antd/lib/typography'
import Space from 'antd/lib/space'
import Divider from 'antd/lib/divider'
import Drawer from 'antd/lib/drawer'

import ProfileLayout from '../../layouts/ProfileLayout'

import { fetchAppointments } from '../../store/actions/appointments'

import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'
import { IAppointment } from '../../types/appointments'
import { IShortService } from '../../types/services'

const Appointment: React.FC = () => {
  const dispatch = useDispatch()

  const { appointments, loading } = useSelector((state: RootState) => state.appointments)

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  return (
    <ProfileLayout title="Запись">
      <Table
        dataSource={appointments}
        loading={loading}
        rowKey={record => record._id || Math.random()}
      >
        <Column title="Имя" dataIndex="name" key="name" />
        <Column title="Телефон" dataIndex="phone" key="phone" />
        <Column title="Дата" dataIndex="date" key="date" render={renderDate} />
        <Column title="Услуга" dataIndex="service" key="service" render={(value: IShortService) => value.name} />
        <Column
          title="Действия"
          key="action"
          render={(_, record: IAppointment) => (
            <Space split={<Divider type="vertical" />}>
              <Popconfirm
                title="Вы действительно хотите удалить запись?"
                onConfirm={() => console.log(record._id)}
                okText="Да"
                cancelText="Нет"
              >
                <Typography.Text type="danger" className="cursor-pointer">
                  Удалить
                </Typography.Text>
              </Popconfirm>

              <Typography.Link onClick={() => setDrawerVisible(true)}>
                Изменить
              </Typography.Link>
            </Space>
          )}
        />
      </Table>

      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </ProfileLayout>
  )
}

export default Appointment