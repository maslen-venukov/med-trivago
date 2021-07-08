import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moment } from 'moment'

import Typography from 'antd/lib/typography'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Calendar from 'antd/lib/calendar'

import ProfileLayout from '../../layouts/ProfileLayout'

import TimeModal from '../../components/services/TimeModal'

import { fetchCreateAppointDate, fetchAppointedDates } from '../../api/appointments'

import { addAppointedDate, setAppointedDates } from '../../store/actions/appointments'

import getServicesFromCurrentHospital from '../../utils/getServicesFromCurrentHospital'
import getDisabledDate from '../../utils/getDisabledDate'
import getAppointmentHours from '../../utils/getAppointmentHours'
import parseAppointedDate from '../../utils/parseAppointedDate'

import { RootState } from '../../store/reducers'
import { IService } from '../../types/services'
import { IAppointmentHour } from '../../types'
import moment from 'moment'

const Busy: React.FC = () => {
  const dispatch = useDispatch()

  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { appointedDates } = useSelector((state: RootState) => state.appointments)

  const [calendarModalVisible, setCalendarModalVisible] = useState<boolean>(false)
  const [timeModalVisible, setTimeModalVisible] = useState<boolean>(false)
  const [appointmentHours, setAppointmentHours] = useState<IAppointmentHour[]>([])
  const [date, setDate] = useState<string>('')
  const [service, setService] = useState<IService | null>(null)

  const services = getServicesFromCurrentHospital(currentHospital)
  const schedule = currentHospital?.serviceList.find(list => list.category === service?.category)?.schedule

  const onChangeCalendarModal = (service: IService | null, visible: boolean) => {
    setService(service)
    setCalendarModalVisible(visible)
  }

  const onChangeAppointmentHours = (date: Moment, appointedDates: Date[]) => {
    if(!schedule) {
      return
    }
    const hours = getAppointmentHours(date, schedule, appointedDates)
    setAppointmentHours(hours)
  }

  const onOpenCalendarModal = (serviceId: string) => {
    const service = services.find(service => service._id === serviceId) as IService
    onChangeCalendarModal(service, true)
    dispatch(fetchAppointedDates(service._id))
  }

  const onCloseCalendarModal = () => {
    onChangeCalendarModal(null, false)
    dispatch(setAppointedDates([]))
  }

  const onOpenTimeModal = (date: Moment) => {
    setTimeModalVisible(true)
    setDate(date.format('DD.MM.YYYY'))
    onChangeAppointmentHours(date, appointedDates)
  }

  const onCloseTimeModal = () => setTimeModalVisible(false)

  const onSelectTime = (time: string) => {
    const appointedDate = parseAppointedDate(date, time)
    service && fetchCreateAppointDate(service._id, appointedDate, () => {
      dispatch(addAppointedDate(appointedDate))
      onChangeAppointmentHours(moment(appointedDate), [...appointedDates, appointedDate])
    })
  }

  return (
    <ProfileLayout title="Занятое время">
      <Typography.Paragraph>Выберите услугу</Typography.Paragraph>

      <Select
        showSearch
        style={{ width: 220 }}
        placeholder="Выберите услугу"
        optionFilterProp="children"
        onSelect={onOpenCalendarModal}
        filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {services.map(service => (
          <Select.Option key={service._id} value={service._id}>{service.name}</Select.Option>
        ))}
      </Select>

      <Modal
        title={service?.name}
        visible={calendarModalVisible}
        onCancel={onCloseCalendarModal}
        footer={null}
      >
        <div className="calendar">
          <Calendar
            disabledDate={date => !!schedule && getDisabledDate(date, schedule)}
            fullscreen={false}
            dateCellRender={date => (
              <button className="calendar__trigger" onClick={() => onOpenTimeModal(date)} />
            )}
          />
        </div>
      </Modal>

      <TimeModal
        title={`${service?.name}, ${date}`}
        visible={timeModalVisible}
        onCancel={onCloseTimeModal}
        appointmentHours={appointmentHours}
        popconfirm={true}
        serviceName={service?.name}
        date={date}
        onSelectTime={onSelectTime}
      />
    </ProfileLayout>
  )
}

export default Busy
