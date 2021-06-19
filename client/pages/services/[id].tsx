import React from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import axios from 'axios'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import Rate from 'antd/lib/rate'
import Tooltip from 'antd/lib/tooltip'
import ClockCircleTwoTone from '@ant-design/icons/ClockCircleTwoTone'
import HomeTwoTone from '@ant-design/icons/HomeTwoTone'
import PhoneTwoTone from '@ant-design/icons/PhoneTwoTone'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/NotFound'
import AppointmentForm from '../../components/AppointmentForm'
import Schedule from '../../components/Schedule'

import getPeriod from '../../utils/getPeriod'
import getPhoneHref from '../../utils/getPhoneHref'

import { IService } from '../../types/services'

interface IServiceProps extends IService {
  error: string
}

const Service: React.FC<IServiceProps> = ({ name, price, schedule, hospital, error }) => {
  const getWeekend = () => {
    const arr = []
    !schedule?.saturday && arr.push(6)
    !schedule?.sunday && arr.push(0)
    return arr
  }

  const rate = Number(price?.toString()[0])

  return (
    <MainLayout>
      {!error ? (
        <Row className="service">
          <Col xs={18}>
            <Typography.Title level={3} className="service__title">{name}</Typography.Title>
            <Typography.Title level={4} type="success">{price} ₽</Typography.Title>
            <Typography.Paragraph>
              <Schedule schedule={schedule}>
                <ClockCircleTwoTone className="icon" /> {schedule && getPeriod(schedule.weekdays)}
              </Schedule>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <HomeTwoTone className="icon" /> {hospital.name}, {hospital.address}
            </Typography.Paragraph>
            <Typography.Paragraph className="service__phone">
              <Link href={`tel:${getPhoneHref(hospital.phone)}`}>
                <a><PhoneTwoTone className="icon mirrored" /> {hospital.phone}</a>
              </Link>
            </Typography.Paragraph>
            <Tooltip title={rate} placement="right">
              <span>
                <Rate disabled defaultValue={rate} />
              </span>
            </Tooltip>
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
    const res = await axios.get(`http://localhost:5000/api/services/${id}`)
    return {
      props: {
        ...res.data.service
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        error: e.response.data.message
      }
    }
  }
}