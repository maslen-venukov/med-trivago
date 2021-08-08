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

import Schedule from '../../components/services/Schedule'

import { fetchHospitals, fetchRemoveHospital } from '../../api/hospitals'
import { fetchCategories } from '../../api/categories'

import { setHospitals } from '../../store/actions/hospitals'
import { setCategories } from '../../store/actions/categories'

import useSearch from '../../hooks/useSearch'

import getPeriod from '../../utils/getPeriod'
import formatPrice from '../../utils/formatPrice'

import { RootState } from '../../store/reducers'
import { IHospital, IServiceList } from '../../types/hospitals'

const Executors = () => {
  const dispatch = useDispatch()

  const { categories } = useSelector((state: RootState) => state.categories)
  const { hospitals, loading } = useSelector((state: RootState) => state.hospitals)

  const [executor, setExecutor] = useState<string | null>(null)
  const [serviceList, setServiceList] = useState<IServiceList | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const getColumnSearchProps = useSearch()

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

  const onRemove = (id: string) => dispatch(fetchRemoveHospital(id))

  useEffect(() => {
    dispatch(fetchHospitals())
    dispatch(fetchCategories())
    return () => {
      dispatch(setHospitals([]))
      dispatch(setCategories([]))
    }
  }, [dispatch])

  return (
    <ProfileLayout title="Список исполнителей" className="executors">
      <Table
        dataSource={hospitals}
        loading={loading}
        size="middle"
        rowKey={record => record._id}
      >
        <Column title="Название" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
        <Column title="Адрес" dataIndex="address" key="address" {...getColumnSearchProps('address')} />
        <Column title="Телефон" dataIndex="phone" key="phone" {...getColumnSearchProps('phone')} />
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
          filters={categories.map(category => ({ text: category.name, value: category._id }))}
          onFilter={(value, record) => {
            const category = categories.find(category => category._id === value)
            return !!record.serviceList.find(list => list.category === category?.name)
          }}
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
              <Typography.Text type="danger" className="cursor-pointer">
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
              <Typography.Text type="success" className="executors__price">{formatPrice(service.price)}</Typography.Text>
            </List.Item>
          )}
        />
      </Modal>
    </ProfileLayout>
  )
}

export default Executors
