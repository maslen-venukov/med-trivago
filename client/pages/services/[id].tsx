import React from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import axios from 'axios'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import Popover from 'antd/lib/popover'
import ClockCircleTwoTone from '@ant-design/icons/ClockCircleTwoTone'
import HomeTwoTone from '@ant-design/icons/HomeTwoTone'
import PhoneTwoTone from '@ant-design/icons/PhoneTwoTone'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/NotFound'
import AppointmentForm from '../../components/AppointmentForm'

import getPeriod from '../../utils/getPeriod'

import { IService } from '../../types/services'

interface IServiceProps extends IService {
  error: string
}

const Service: React.FC<IServiceProps> = ({ name, price, schedule, hospital, error }) => {
  const popover = (
    <div className="service__schedule">
      <Typography.Paragraph>Будние: {getPeriod(schedule?.weekdays)}</Typography.Paragraph>
      <Typography.Paragraph>Суббота: {getPeriod(schedule?.saturday)}</Typography.Paragraph>
      <Typography.Paragraph>Воскресенье: {getPeriod(schedule?.sunday)}</Typography.Paragraph>
    </div>
  )

  const getWeekend = () => {
    const arr = []
    !schedule?.saturday && arr.push(6)
    !schedule?.sunday && arr.push(0)
    return arr
  }

  return (
    <MainLayout>
      {!error ? (
        <Row className="service">
          <Col xs={18}>
            <Typography.Title level={3} className="service__title">{name}</Typography.Title>
            <Typography.Title level={4} type="success">{price} ₽</Typography.Title>
              <Typography.Paragraph>
                <Popover content={popover} title="График работы" placement="right">
                  <ClockCircleTwoTone className="icon" /> {schedule && getPeriod(schedule.weekdays)}
                </Popover>
              </Typography.Paragraph>
            <Typography.Paragraph>
              <HomeTwoTone className="icon" /> {hospital.name}, {hospital.address}
            </Typography.Paragraph>
            <Typography.Paragraph className="service__phone">
              <Link href={`tel:${hospital.phone.replace(/[^+\d]+/g, '')}`}>
                <a><PhoneTwoTone className="icon mirrored" /> {hospital.phone}</a>
              </Link>
            </Typography.Paragraph>
          </Col>
          <Col xs={6}>
            <AppointmentForm weekend={getWeekend()} schedule={schedule} />
          </Col>
        </Row>
      ) : <NotFound />}
    </MainLayout>
  )
}

export default Service

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { id } = context.query
    const service = await axios.get(`http://localhost:5000/api/services/${id}`)
    return {
      props: {
        ...service.data.service
      }
    }
  } catch (e) {
    return {
      props: {
        error: e.response.data.message
      }
    }
  }
}