import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moment } from 'moment'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import Typography from 'antd/lib/typography'
import Drawer from 'antd/lib/drawer'
import Modal from 'antd/lib/modal/Modal'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import TimePicker from 'antd/lib/time-picker'

import ProfileLayout from '../../layouts/ProfileLayout'

import WeekendDaySchedule from '../../components/categories/WeekendDaySchedule'

import { fetchCategories } from '../../store/actions/categories'
import { fetchAddActiveCategory, fetchRemoveActiveCategory, fetchCurrentHospital } from '../../store/actions/hospitals'

import { RootState } from '../../store/reducers'
import { ICategory } from '../../types/categories'
import { IAddCategoryData } from '../../types/hospitals'

export interface IWeekendState {
  saturday: boolean
  sunday: boolean
}

interface IAddCategoryFormValues {
  weekdays: [Moment, Moment]
  saturday: [Moment, Moment]
  sunday: [Moment, Moment]
}

export type Day = 'saturday' | 'sunday'

const ActiveCategories: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { categories, loading } = useSelector((state: RootState) => state.categories)

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [category, setCategory] = useState<string | null>(null)
  const [weekend, setWeekend] = useState<IWeekendState>({ saturday: false, sunday: false })

  const activeCategories = currentHospital?.serviceList.map(list => list.category)

  const onSelectActive = (e: CheckboxChangeEvent) => {
    const { value, checked } = e.target
    if(checked) {
      setCategory(value)
      setModalVisible(true)
    } else {
      dispatch(fetchRemoveActiveCategory(value))
    }
  }

  const onCloseModal = () => {
    setModalVisible(false)
    setCategory(null)
    form.resetFields()
    setWeekend({ saturday: false, sunday: false })
  }

  const checkActive = (id: string) => activeCategories?.includes(id)

  const onAddCategory = (values: IAddCategoryFormValues) => {
    const format = 'HH:mm'
    const days: Day[] = ['saturday', 'sunday']

    const data: IAddCategoryData = {
      schedule: {
        weekdays: {
          start: values.weekdays[0].format(format),
          end: values.weekdays[1].format(format)
        }
      },
      category: category || ''
    }

    days.forEach((day => {
      if(!weekend[day]) {
        const daySchedule = {
          start: values[day][0].format(format),
          end: values[day][1].format(format)
        }
        data.schedule[day] = daySchedule
      }
    }))

    dispatch(fetchAddActiveCategory(data))
    onCloseModal()
  }

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchCurrentHospital())
  }, [dispatch])

  return (
    <ProfileLayout title="Активные категории" className="active-categories">
      <Typography.Title level={5}>Выберите категории, по которым хотите предоставлять услуги</Typography.Title>

      <Table
        dataSource={categories}
        loading={loading && !!currentHospital}
        size="middle"
        rowKey={record => record._id}
        className="active-categories__table"
      >
        <Column width="32px" dataIndex="active" key="active" render={(_, record: ICategory) => (
          <Checkbox
            value={record._id}
            checked={checkActive(record._id)}
            onChange={onSelectActive}
          />
        )} />
        <Column title="Название" dataIndex="name" key="name" />
        <Column
          title="Количество услуг"
          dataIndex="services"
          key="services"
          render={(_, record: ICategory) => currentHospital?.serviceList.find(list => list.category === record._id)?.services.length}
        />
        <Column
          title="Раписание"
          dataIndex="services"
          key="services"
          render={(_, record: ICategory) => checkActive(record._id) && (
            <Typography.Link onClick={() => setDrawerVisible(true)} className="cursor-pointer">
              Изменить
            </Typography.Link>
          )}
        />
      </Table>

      <Modal
        title="Расписание"
        visible={modalVisible}
        onCancel={onCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onAddCategory}>
          <Form.Item
            label="Будние"
            name="weekdays"
            rules={[{ required: true, message: 'Пожалуйста введите расписание в будние дни!' }]}
          >
            <TimePicker.RangePicker format="HH:mm" minuteStep={30} />
          </Form.Item>

          <WeekendDaySchedule
            name="saturday"
            label="Суббота"
            message="Пожалуйста введите расписание в субботу!"
            state={weekend}
            setState={setWeekend}
          />

          <WeekendDaySchedule
            label="Воскресенье"
            name="sunday"
            message="Пожалуйста введите расписание в воскресенье!"
            state={weekend}
            setState={setWeekend}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Basic Drawer"
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

export default ActiveCategories
