import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Tag from 'antd/lib/tag'
import Modal from 'antd/lib/modal'
import List from 'antd/lib/list'
import Typography from 'antd/lib/typography'
import Popconfirm from 'antd/lib/popconfirm'
import ClockCircleTwoTone from '@ant-design/icons/ClockCircleTwoTone'

import ProfileLayout from '../../layouts/ProfileLayout'

import Schedule from '../../components/Schedule'

import { fetchHospitals, fetchRemoveHospital } from '../../store/actions/hospitals'

import getPeriod from '../../utils/getPeriod'

import { RootState } from '../../store/reducers'
import { IHospital, IServiceList } from '../../types/hospitals'
import { Roles } from '../../types'

const Executors = () => {
  const dispatch = useDispatch()

  const { user, token } = useSelector((state: RootState) => state.user)
  const { hospitals, loading } = useSelector((state: RootState) => state.hospitals)

  const [executor, setExecutor] = useState<string | null>(null)
  const [serviceList, setServiceList] = useState<IServiceList | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const onOpenModal = (executor: string, services: IServiceList) => {
    setExecutor(executor)
    setServiceList(services)
    setModalVisible(true)
  }

  const onCloseModal = () => {
    setModalVisible(false)
    setExecutor(null)
    setServiceList(null)
  }

  // TODO сделать страницы исполнителя в админке
  // TODO сделать запись на оказание услуг

  const onRemove = (id: string) => {
    token && dispatch(fetchRemoveHospital(id, token))
  }

  useEffect(() => {
    token && user?.role === Roles.Admin && dispatch(fetchHospitals(token))
  }, [dispatch, token, user])

  return (
    <ProfileLayout title="Список исполнителей" className="executors">
      <Table
        dataSource={hospitals}
        loading={loading}
        rowKey={record => record._id}
      >
        <Column title="Название" dataIndex="name" key="name" />
        <Column title="Адрес" dataIndex="address" key="address" />
        <Column title="Телефон" dataIndex="phone" key="phone" />
        <Column title="График работы" dataIndex="schedule" key="schedule" render={getPeriod} />
        <Column
          title="Услуги"
          dataIndex="services"
          key="services"
          render={(_, record: IHospital) => (
            record.serviceList.map(list => (
              <Tag
                color="blue"
                key={list.category}
                className="cursor-pointer"
                onClick={() => onOpenModal(record.name, list)}
              >
                {list.category}
              </Tag>
            ))
          )}
        />
        <Column
          title="Действия"
          key="action"
          render={(_, record: IHospital) => (
            <Popconfirm
              title="Вы действительно хотите удалить исполнителя?"
              onConfirm={() => onRemove(record._id)}
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

      <Modal
        title={`${executor} — ${serviceList?.category}`}
        visible={modalVisible}
        footer={null}
        onCancel={onCloseModal}
      >
        <Typography.Paragraph>
          <Schedule schedule={serviceList?.schedule}>
            <ClockCircleTwoTone className="icon" /> {getPeriod(serviceList?.schedule.weekdays)}
          </Schedule>
        </Typography.Paragraph>
        <List
          dataSource={serviceList?.services}
          renderItem={service => (
            <List.Item key={service._id}>
              <Typography.Text>{service.name}</Typography.Text>
              <Typography.Text type="success">{service.price} ₽</Typography.Text>
            </List.Item>
          )}
        />
      </Modal>
    </ProfileLayout>
  )
}

export default Executors
