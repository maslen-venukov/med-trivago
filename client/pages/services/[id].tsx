import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import axios from 'axios'
import moment, { Moment } from 'moment'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import Rate from 'antd/lib/rate'
import Tooltip from 'antd/lib/tooltip'
import Calendar from 'antd/lib/calendar'
import ClockCircleTwoTone from '@ant-design/icons/ClockCircleTwoTone'
import HomeTwoTone from '@ant-design/icons/HomeTwoTone'
import PhoneTwoTone from '@ant-design/icons/PhoneTwoTone'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/NotFound'
import Schedule from '../../components/services/Schedule'
import TimeModal from '../../components/services/TimeModal'
import AppointmentModal, { IAppointmentFormValues } from '../../components/services/AppointmentModal'

import { setSocket } from '../../store/actions/socket'
import { fetchCreateAppointment } from '../../store/actions/appointments'

import getPeriod from '../../utils/getPeriod'
import getPhoneHref from '../../utils/getPhoneHref'
import getAppointmentHours from '../../utils/getAppointmentHours'
import connectSocket from '../../utils/connectSocket'

import { IService } from '../../types/services'
import { IHospital } from '../../types/hospitals'
import { IAppointment } from '../../types/appointments'
import { IAppointmentHour, IWeekSchedule } from '../../types'
import { RootState } from '../../store/reducers'

interface IServiceProps extends IService {
  error: string
  hospital: IHospital
  schedule: IWeekSchedule
}

const Service: React.FC<IServiceProps> = ({ name, price, schedule, hospital, error }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { socket } = useSelector((state: RootState) => state.socket)

  const [appointmentModalVisible, setAppointmentModalVisible] = useState<boolean>(false)
  const [timeModalVisible, setTimeModalVisible] = useState<boolean>(false)
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [appointmentHours, setAppointmentHours] = useState<IAppointmentHour[]>([])

  const modalWidth = 525

  const getWeekend = (schedule: IWeekSchedule) => {
    const arr = []
    !schedule?.saturday && arr.push(5)
    !schedule?.sunday && arr.push(6)
    return arr
  }

  const getDisabledDate = (date: Moment) => {
    const isWeekend = getWeekend(schedule).includes(date.weekday())
    const isBefore = date.isBefore(moment(new Date()).add(-1, 'days'))
    return isWeekend || isBefore
  }

  const onChangeTimeModal = (visible: boolean, date: string, hours: IAppointmentHour[]) => {
    setTimeModalVisible(visible)
    setDate(date)
    setAppointmentHours(hours)
  }

  const onChangeAppointmentModal = (visible: boolean, time: string) => {
    setAppointmentModalVisible(visible)
    setTime(time)
  }

  const onOpenTimeModal = (date: Moment) => onChangeTimeModal(true, date.format('DD.MM.YYYY'), getAppointmentHours(date, schedule))
  const onCloseTimeModal = () => onChangeTimeModal(false, '', [])

  const onOpenAppointmentModal = (time: string) => onChangeAppointmentModal(true, time)
  const onCloseAppointmentModal = () => onChangeAppointmentModal(false, '')

  const onAppoint = (values: IAppointmentFormValues) => {
    const data = ({
      ...values,
      date: new Date(`${date.split('.').reverse().join('-')} ${time}`),
      service: router.query.id
    }) as IAppointment

    const fetchData = (socket: Socket) => fetchCreateAppointment(data, hospital._id, socket)

    if(socket) {
      fetchData(socket)
    } else {
      const newSocket = connectSocket()
      dispatch(setSocket(newSocket))
      fetchData(newSocket)
    }
  }

  useEffect(() => {
    console.log(socket)
  }, [socket])

  // TODO доделать запись
  // TODO сделать вывод записей для больницы
  // TODO рефакторинг
  // TODO пагинация на странице поиска
  // TODO сделать страницу с записями
  // TODO разбить компоненты на папки
  // TODO возможно переделать lazyInput на хуки
  // TODO сделать удаление услуг (если есть записи по ней - deleted: true, если нет - удалить полностью)
  // TODO по удалению больницы удалять и записи на прием (а может и нет)

  const rate = Number(price?.toString()[0])

  return (
    <MainLayout title={name} keywords={[name, hospital.name, hospital.address, hospital.phone]}>
      {!error ? (
        <Row className="service">
          <Col xs={18}>
            <Typography.Title level={3} className="service__title">{name}</Typography.Title>

            <Typography.Title level={4} type="success">{price} ₽</Typography.Title>

            <Typography.Paragraph>
              <Schedule schedule={schedule}>
                <ClockCircleTwoTone className="icon" /> {getPeriod(schedule?.weekdays)}
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

            <div className="service__rate">
              <Tooltip title={rate} placement="right">
                <span>
                  <Rate disabled defaultValue={rate} />
                </span>
              </Tooltip>
            </div>

            <div className="service__calendar">
              <Calendar
                disabledDate={getDisabledDate}
                fullscreen={false}
                dateCellRender={date => (
                  <button className="service__trigger" onClick={() => onOpenTimeModal(date)} />
                )}
              />
            </div>

            <TimeModal
              title={date}
              visible={timeModalVisible}
              footer={null}
              width={modalWidth}
              onCancel={onCloseTimeModal}
              appointmentHours={appointmentHours}
              onOpenAppointmentModal={onOpenAppointmentModal}
            />

            <AppointmentModal
              title={`${time} ${date}`}
              visible={appointmentModalVisible}
              footer={null}
              width={modalWidth}
              onCancel={onCloseAppointmentModal}
              onFinish={onAppoint}
            />
          </Col>

          <Col xs={6}>
            {/* TODO место под рекламу */}
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
    const res = await axios.get(`/api/services/${id}`)
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