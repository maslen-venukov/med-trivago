import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moment } from 'moment'

import Form from 'antd/lib/form'
import Button from 'antd/lib/button'

import ProfileLayout from '../../layouts/ProfileLayout'

import HospitalInfoForm from '../../components/hospitals/HospitalInfoForm'
import Loading from '../../components/app/Loading'

import { fetchUpdateHospital } from '../../api/hospitals'

import { parseTime } from '../../utils/getActiveCategoryFormData'
import formatSchedule from '../../utils/formatSchedule'

import { RootState } from '../../store/reducers'

interface IInfoFormValues {
  name: string
  address: string
  phone: string
  schedule: [Moment, Moment]
}

const Info: React.FC = () => {
  const dispatch = useDispatch()

  const { currentHospital, loading } = useSelector((state: RootState) => state.hospitals)

  const initialValues = currentHospital && {
    ...currentHospital,
    schedule: [
      parseTime(currentHospital.schedule.start),
      parseTime(currentHospital.schedule.end)
    ]
  }

  const onUpdate = (values: IInfoFormValues) => {
    const schedule = formatSchedule(values.schedule)
    const data = { ...values, schedule }
    dispatch(fetchUpdateHospital(data))
  }

  return (
    <ProfileLayout title="Информация">
      {currentHospital ? (
        <Form
          onFinish={onUpdate}
          layout="vertical"
          initialValues={initialValues || {}}
          className="form form--info"
          onChange={values => console.log(values)}
        >
          <HospitalInfoForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Form.Item>
        </Form>
      ) : <Loading />}
    </ProfileLayout>
  )
}

export default Info
