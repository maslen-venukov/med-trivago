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
import Calendar from 'antd/lib/calendar'
import Form from 'antd/lib/form'
import ClockCircleTwoTone from '@ant-design/icons/ClockCircleTwoTone'
import HomeTwoTone from '@ant-design/icons/HomeTwoTone'
import PhoneTwoTone from '@ant-design/icons/PhoneTwoTone'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/app/NotFound'
import Schedule from '../../components/services/Schedule'
import TimeModal from '../../components/services/TimeModal'
import AppointmentModal, { IAppointmentFormValues } from '../../components/services/AppointmentModal'

import { setSocket } from '../../store/actions/socket'
import { fetchAppointedDates, fetchCreateAppointment } from '../../api/appointments'

import { setAppointedDates } from '../../store/actions/appointments'

import getPeriod from '../../utils/getPeriod'
import getPhoneHref from '../../utils/getPhoneHref'
import getAppointmentHours from '../../utils/getAppointmentHours'
import connectSocket from '../../utils/connectSocket'
import formatPrice from '../../utils/formatPrice'
import getDisabledDate from '../../utils/getDisabledDate'
import parseAppointedDate from '../../utils/parseAppointedDate'

import { IService } from '../../types/services'
import { IHospital } from '../../types/hospitals'
import { IShortAppointment } from '../../types/appointments'
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
  const [form] = Form.useForm()

  const { socket } = useSelector((state: RootState) => state.socket)
  const { appointedDates } = useSelector((state: RootState) => state.appointments)

  const [appointmentModalVisible, setAppointmentModalVisible] = useState<boolean>(false)
  const [timeModalVisible, setTimeModalVisible] = useState<boolean>(false)
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [appointmentHours, setAppointmentHours] = useState<IAppointmentHour[]>([])

  const onChangeTimeModal = (visible: boolean, date: string, hours: IAppointmentHour[]) => {
    setTimeModalVisible(visible)
    setDate(date)
    setAppointmentHours(hours)
  }

  const onChangeAppointmentModal = (visible: boolean, time: string) => {
    setAppointmentModalVisible(visible)
    setTime(time)
  }

  const onOpenTimeModal = (date: Moment) => onChangeTimeModal(true, date.format('DD.MM.YYYY'), getAppointmentHours(date, schedule, appointedDates))
  const onCloseTimeModal = () => onChangeTimeModal(false, '', [])

  const onOpenAppointmentModal = (time: string) => onChangeAppointmentModal(true, time)
  const onCloseAppointmentModal = () => onChangeAppointmentModal(false, '')

  const fetchData = (data: IShortAppointment, socket: Socket) => dispatch(fetchCreateAppointment(data, hospital._id, socket))

  const onAppoint = (values: IAppointmentFormValues) => {
    const serviceId = router.query.id
    const data = ({
      ...values,
      date: parseAppointedDate(date, time),
      service: (typeof serviceId === 'string' && serviceId) || ''
    })

    if(socket) {
      fetchData(data, socket)
    } else {
      const newSocket = connectSocket()
      dispatch(setSocket(newSocket))
      fetchData(data, newSocket)
    }

    onCloseAppointmentModal()
    onCloseTimeModal()
    form.resetFields()
  }

  // TODO поменять поиск + пагинация

  // TODO header

  // TODO страницы: персональнеые данные, политика конфеденциальности, куки файлы
  // TODO текст письма

  // TODO ? не выводить прошедшие записи в таблицу
  // TODO ? сделать поле seen у новых записей
  // TODO ? по удалению больницы удалять и записи на прием (а может и нет)

  useEffect(() => {
    const serviceId = router.query.id
    if(serviceId && typeof serviceId === 'string') {
      dispatch(fetchAppointedDates(serviceId))
    }
    return () => {
      dispatch(setAppointedDates([]))
    }
  }, [dispatch])

  return (
    <MainLayout
      title={name}
      keywords={!error ? [name, formatPrice(price), hospital.name, hospital.address, hospital.phone] : []}
    >
      {!error ? (
        <Row className="service">
          <Col xs={18}>
            <Typography.Title level={3} className="service__title">{name}</Typography.Title>

            <Typography.Title level={4} type="success">{formatPrice(price)}</Typography.Title>

            <Typography.Paragraph>
              <Schedule schedule={schedule}>
                <ClockCircleTwoTone className="icon" /> {getPeriod(schedule?.weekdays)}
              </Schedule>
            </Typography.Paragraph>

            <Typography.Paragraph>
              <HomeTwoTone className="icon" /> {hospital.name}, {hospital.address}
            </Typography.Paragraph>

            <Typography.Paragraph className="service__phone">
              <Link href={getPhoneHref(hospital.phone)}>
                <a><PhoneTwoTone className="icon mirrored" /> {hospital.phone}</a>
              </Link>
            </Typography.Paragraph>

            <div className="calendar">
              <Calendar
                disabledDate={date => getDisabledDate(date, schedule)}
                fullscreen={false}
                dateCellRender={date => (
                  <button className="calendar__trigger" onClick={() => onOpenTimeModal(date)} />
                )}
              />
            </div>

            <TimeModal
              title={date}
              visible={timeModalVisible}
              onCancel={onCloseTimeModal}
              appointmentHours={appointmentHours}
              onSelectTime={onOpenAppointmentModal}
            />

            <AppointmentModal
              title={`${time}, ${date}`}
              visible={appointmentModalVisible}
              form={form}
              onCancel={onCloseAppointmentModal}
              onFinish={onAppoint}
            />
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