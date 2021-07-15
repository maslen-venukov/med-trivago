import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import moment, { Moment } from 'moment'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'
import Typography from 'antd/lib/typography'
import Space from 'antd/lib/space'
import Divider from 'antd/lib/divider'
import Drawer from 'antd/lib/drawer'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import DatePicker from 'antd/lib/date-picker'
import Select from 'antd/lib/select'

import ProfileLayout from '../../layouts/ProfileLayout'

import { fetchAppointments, fetchRemoveAppointment, fetchUpdateAppointment } from '../../api/appointments'

import { setAppointments } from '../../store/actions/appointments'

import useSearch from '../../hooks/useSearch'

import renderDate from '../../utils/renderDate'
import getPhoneHref from '../../utils/getPhoneHref'
import getServicesFromCurrentHospital from '../../utils/getServicesFromCurrentHospital'

import { RootState } from '../../store/reducers'
import { IAppointment } from '../../types/appointments'
import { IShortService } from '../../types/services'

interface IUpdateAppointmentFormValues {
  name: string
  phone: string
  date: Moment
  service: string
}

const Appointment: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm<IUpdateAppointmentFormValues>()

  const { appointments, loading } = useSelector((state: RootState) => state.appointments)
  const { currentHospital } = useSelector((state: RootState) => state.hospitals)

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)

  const getColumnSearchProps = useSearch()

  const services = getServicesFromCurrentHospital(currentHospital)

  const onOpenDrawer = (data: IAppointment) => {
    const service = services?.find(service => typeof data.service !== 'string' && service._id === data.service._id)

    const appointment = {
      name: data.name,
      phone: data.phone,
      date: moment(data.date),
      service: service?._id || ''
    }

    form.setFieldsValue(appointment)
    setAppointmentId(data._id || '')
    setDrawerVisible(true)
  }

  const onCloseDrawer = () => {
    setAppointmentId(null)
    setDrawerVisible(false)
  }

  const onRemove = (id: string) => dispatch(fetchRemoveAppointment(id))

  const onUpdate = (values: IUpdateAppointmentFormValues) => {
    const data = {
      ...values,
      date: new Date(values.date.toString())
    }
    dispatch(fetchUpdateAppointment(appointmentId || '', data))
    setDrawerVisible(false)
  }

  useEffect(() => {
    dispatch(fetchAppointments())
    return () => {
      dispatch(setAppointments([]))
    }
  }, [dispatch])

  return (
    <ProfileLayout title="Запись" className="appointment">
      <Table
        dataSource={appointments}
        loading={loading}
        size="middle"
        rowKey={record => record._id}
        onRow={record => ({
          className: new Date(record.date) < new Date ? 'past-time-row' : ''
        })}
      >
        <Column title="Имя" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
        <Column
          title="Телефон"
          dataIndex="phone"
          key="phone"
          {...getColumnSearchProps('phone')}
          render={value => (
            <Link href={getPhoneHref(value)}>
              <a className="appointment__phone">{value}</a>
            </Link>
          )}
        />
        <Column
          title="Дата"
          dataIndex="date"
          key="date"
          render={renderDate}
          sorter={(a: IAppointment, b: IAppointment) => a.date > b.date ? 1 : -1}
        />
        <Column
          title="Услуга"
          dataIndex="service"
          key="service"
          render={(value: IShortService) => value.name}
          filters={appointments
            .map(appointment => ({
              text: appointment.service.name,
              value: appointment.service._id
            }))
            .filter((service, index, arr) => (
              index === arr.findIndex(el => el.value === service.value)
            ))
            .sort((a, b) => a.text.localeCompare(b.text, 'ru'))
          }
          onFilter={(value, record: IAppointment) => value === record.service._id}
        />
        <Column
          title="Действия"
          key="action"
          render={(_, record: IAppointment) => (
            <Space split={<Divider type="vertical" />}>
              <Typography.Link onClick={() => onOpenDrawer(record)}>
                Изменить
              </Typography.Link>

              <Popconfirm
                title="Вы действительно хотите удалить запись?"
                onConfirm={() => onRemove(record._id || '')}
                okText="Да"
                cancelText="Нет"
              >
                <Typography.Text type="danger" className="cursor-pointer">
                  Удалить
                </Typography.Text>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Drawer
        title="Заголовок"
        onClose={onCloseDrawer}
        visible={drawerVisible}
        width="400"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onUpdate}
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="Номер телефона"
            name="phone"
            rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="Дата"
            name="date"
            rules={[{ required: true, message: 'Пожалуйста введите дату!' }]}
          >
            <DatePicker showTime format="HH:mm, DD.MM.YYYY" minuteStep={30} />
          </Form.Item>

          <Form.Item
            label="Услуга"
            name="service"
            rules={[{ required: true, message: 'Пожалуйста выберите услугу!' }]}
          >
            <Select>
              <Select.Option value="" disabled>
                <span className="placeholder">Услуга</span>
              </Select.Option>
              {services?.map(service => {
                const id = service._id || Math.random()
                return (
                  <Select.Option key={id} value={id}>
                    {service.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </ProfileLayout>
  )
}

export default Appointment