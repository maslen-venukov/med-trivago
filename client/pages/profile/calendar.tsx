import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import moment, { Moment } from 'moment'

import AntdCalendar from 'antd/lib/calendar'
import Typography from 'antd/lib/typography'
import Select from 'antd/lib/select'
import Tag from 'antd/lib/tag'
import Modal from 'antd/lib/modal'
import List from 'antd/lib/list'

import ProfileLayout from '../../layouts/ProfileLayout'

import Loading from '../../components/app/Loading'

import { fetchAppointedDates, fetchAppointmentByServiceAndDate } from '../../api/appointments'

import getServicesFromCurrentHospital from '../../utils/getServicesFromCurrentHospital'
import getAppointmentHours from '../../utils/getAppointmentHours'
import getDisabledDate from '../../utils/getDisabledDate'
import renderDate from '../../utils/renderDate'
import getPhoneHref from '../../utils/getPhoneHref'

import { Colors, IAppointmentHour, IWeekSchedule } from '../../types'
import { RootState } from '../../store/reducers'
import { IService } from '../../types/services'
import { IAppointment } from '../../types/appointments'

const Calendar: React.FC = () => {
  const dispatch = useDispatch()

  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { appointedDates } = useSelector((state: RootState) => state.appointments)

  const [service, setService] = useState<IService | null>(null)
  const [schedule, setSchedule] = useState<IWeekSchedule | null>(null)
  const [services, setServices] = useState<IService[] | null>(null)
  const [appointmentHours, setAppointmentHours] = useState<IAppointmentHour[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [date, setDate] = useState<string>(new Date().toLocaleDateString())
  const [appointment, setAppointment] = useState<IAppointment | null>(null)

  const onSelectService = (value: string) => {
    const service = services?.find(service => service._id === value) || null
    setService(service)
  }

  const onSelectDate = (date: Moment) => {
    const hours = schedule ? getAppointmentHours(date, schedule, appointedDates) : []
    setAppointmentHours(hours)
    setDate(date.toDate().toLocaleDateString())
  }

  const onSelectTime = async (time: string) => {
    if(!service) return
    setModalVisible(true)
    setLoading(true)
    const appointment = await fetchAppointmentByServiceAndDate(service._id, new Date(`${time} ${date.split('.').reverse()}`))
    setLoading(false)
    setAppointment(appointment)
  }

  useEffect(() => {
    currentHospital && setServices(getServicesFromCurrentHospital(currentHospital))
  }, [currentHospital])

  useEffect(() => {
    services && setService(services[0])
  }, [services])

  useEffect(() => {
    if(service) {
      setLoading(true)
      dispatch(fetchAppointedDates(service._id, () => setLoading(false)))
      setSchedule(currentHospital?.serviceList.find(list => list.category === service.category)?.schedule || null)
    }
  }, [service])

  useEffect(() => {
    if(appointedDates) {
      const hours = schedule ? getAppointmentHours(moment(), schedule, appointedDates) : []
      setAppointmentHours(hours)
    }
  }, [appointedDates])

  return services ? (
    <ProfileLayout title="Календарь" className="busy-time">
      {services.length ? <>
        <div className="busy-time__select">
          <Typography.Paragraph className="busy-time__label">Выберите услугу</Typography.Paragraph>
          <Select
            showSearch
            placeholder="Выберите услугу"
            optionFilterProp="children"
            defaultValue={service?._id}
            onSelect={onSelectService}
            filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {services.map(service => (
              <Select.Option key={service._id} value={service._id}>{service.name}</Select.Option>
            ))}
          </Select>
        </div>

        <div className="calendar-wrapper">
          <div className="calendar">
            <AntdCalendar
              disabledDate={date => !!schedule && getDisabledDate(date, schedule)}
              fullscreen={false}
              dateCellRender={date => (
                <button className="calendar__trigger" onClick={() => onSelectDate(date)} />
              )}
            />
          </div>

          <div className="calendar-wrapper__hours">
            {loading ? <Loading /> : appointmentHours.map(hour => (
              <Tag
                key={hour.label}
                color={hour.appointed ? Colors.Red : Colors.Accent}
                style={{ cursor: hour.appointed ? 'pointer' : 'default' }}
                onClick={() => hour.appointed && onSelectTime(hour.label)}
                className="service__appointment-hour"
              >
                {hour.label}
              </Tag>
            ))}
          </div>
        </div>

        <Modal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          {loading
            ? <Loading />
            : appointment
              ? (
                <List>
                  <List.Item>Услуга: {service?.name}</List.Item>
                  <List.Item>Дата: {renderDate(appointment.date.toString())}</List.Item>
                  <List.Item>ФИО: {appointment.name}</List.Item>
                  <List.Item>Номер телефона: <Link href={getPhoneHref(appointment.phone)}><a>{appointment.phone}</a></Link></List.Item>
                </List>
              )
              : 'Время указано вами, как занятое'}
        </Modal>
      </> : (
        <Typography.Title level={5}>У вас нет услуг, добавьте их в соответствующей вкладке в меню слева</Typography.Title>
      )}
    </ProfileLayout>
  ) : <Loading />
}

export default Calendar
