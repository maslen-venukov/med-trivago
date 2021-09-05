import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moment } from 'moment'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import Typography from 'antd/lib/typography'
import Form from 'antd/lib/form'

import ProfileLayout from '../../layouts/ProfileLayout'

import ToggleActiveCheckbox from '../../components/categories/ToggleActiveCheckbox'
import ActiveCategoriesModal from '../../components/categories/ActiveCategoriesModal'

import { fetchCategories } from '../../api/categories'
import { fetchAddActiveCategory, fetchRemoveActiveCategory, fetchCurrentHospital, fetchUpdateActiveCategory } from '../../api/hospitals'

import { setCategories } from '../../store/actions/categories'

import useSearch from '../../hooks/useSearch'

import getActiveCategorySchedule from '../../utils/getActiveCategorySchedule'
import getActiveCategoryFormData from '../../utils/getActiveCategoryFormData'

import { RootState } from '../../store/reducers'
import { ICategory } from '../../types/categories'
import { IWeekSchedule } from '../../types'

export interface IWeekendState {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface IActiveCategoryFormValues {
  monday?: [Moment, Moment]
  tuesday?: [Moment, Moment]
  wednesday?: [Moment, Moment]
  thursday?: [Moment, Moment]
  friday?: [Moment, Moment]
  saturday?: [Moment, Moment]
  sunday?: [Moment, Moment]
  mondayWeekend: boolean
  tuesdayWeekend: boolean
  wednesdayWeekend: boolean
  thursdayWeekend: boolean
  fridayWeekend: boolean
  saturdayWeekend: boolean
  sundayWeekend: boolean
}

const defaultWeekendState = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
}

const ActiveCategories: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { categories, loading } = useSelector((state: RootState) => state.categories)

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [weekend, setWeekend] = useState<IWeekendState>(defaultWeekendState)

  const getColumnSearchProps = useSearch()

  const activeCategories = currentHospital?.serviceList.map(list => list.category)

  const checkActive = (id: string) => activeCategories?.includes(id)

  const getServicesLength = (record: ICategory) => currentHospital?.serviceList.find(list => list.category === record._id)?.services.length || '0'

  const onOpenModal = (setModalVisible: (visible: boolean) => void, categoryId: string) => {
    setModalVisible(true)
    setCategoryId(categoryId)
  }

  const onCloseModal = () => {
    setAddModalVisible(false)
    setUpdateModalVisible(false)
    setCategoryId(null)
    setWeekend(defaultWeekendState)
    setTimeout(form.resetFields, 300)
  }

  const onFinish = (
    values: IActiveCategoryFormValues,
    fetchActiveCategory: (id: string, data: { schedule: IWeekSchedule }
  ) => void) => {
    const schedule = getActiveCategorySchedule(values, weekend)
    dispatch(fetchActiveCategory(categoryId || '', { schedule }))
    onCloseModal()
  }

  const onOpenAddModal = (e: CheckboxChangeEvent) => {
    const { value, checked } = e.target
    if(checked) {
      onOpenModal(setAddModalVisible, value)
    }
  }

  const onOpenEditModal = (record: ICategory) => {
    const schedule = currentHospital?.serviceList.find(list => list.category === record._id)?.schedule
    const data = getActiveCategoryFormData(schedule)
    onOpenModal(setUpdateModalVisible, record._id)

    const getWeekend = (schedule?: IWeekSchedule) => {
      if(!schedule) {
        return defaultWeekendState
      }

      const days = Object.entries(schedule).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: !value
      }), {})

      return {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
        ...days
      }
    }

    setWeekend(getWeekend(schedule))
    form.setFieldsValue(data)
  }

  const onAdd = (values: IActiveCategoryFormValues) => onFinish(values, fetchAddActiveCategory)

  const onUpdate = (values: IActiveCategoryFormValues) => onFinish(values, fetchUpdateActiveCategory)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchCurrentHospital())
    return () => {
      dispatch(setCategories([]))
    }
  }, [dispatch])

  return (
    <ProfileLayout title="Активные категории" className="active-categories">
      <Typography.Title level={5} className="active-categories__title">
        Выберите категории, по которым хотите предоставлять услуги
      </Typography.Title>

      <Table
        dataSource={categories}
        loading={!!currentHospital && loading}
        size="middle"
        rowKey={record => record._id}
        className="active-categories__table"
      >
        <Column
          width="32px"
          dataIndex="active"
          key="active"
          render={(_, record: ICategory) => (
            <ToggleActiveCheckbox
              checked={checkActive(record._id)}
              value={record._id}
              onChange={onOpenAddModal}
              onRemove={() => dispatch(fetchRemoveActiveCategory(record._id))}
            />
          )}
        />
        <Column title="Название" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
        <Column
          title="Количество услуг"
          dataIndex="services"
          key="services"
          render={(_, record: ICategory) => currentHospital?.serviceList.find(list => list.category === record._id) && getServicesLength(record)}
          sorter={(a, b) => Number(getServicesLength(a)) - Number(getServicesLength(b))}
        />
        <Column
          title="Раписание"
          dataIndex="services"
          key="services"
          render={(_, record: ICategory) => checkActive(record._id) && (
            <Typography.Link onClick={() => onOpenEditModal(record)} className="cursor-pointer">
              Изменить
            </Typography.Link>
          )}
        />
      </Table>

      <ActiveCategoriesModal
        categoryName={categories.find(category => category._id === categoryId)?.name || ''}
        visible={addModalVisible}
        form={form}
        weekend={weekend}
        onCancel={onCloseModal}
        onFinish={onAdd}
        setWeekend={setWeekend}
      />

      <ActiveCategoriesModal
        categoryName={categories.find(category => category._id === categoryId)?.name || ''}
        visible={updateModalVisible}
        form={form}
        weekend={weekend}
        onCancel={onCloseModal}
        onFinish={onUpdate}
        setWeekend={setWeekend}
      />
    </ProfileLayout>
  )
}

export default ActiveCategories