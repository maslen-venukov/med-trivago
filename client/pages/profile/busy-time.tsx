import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment, { Moment } from 'moment'

import Typography from 'antd/lib/typography'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Calendar from 'antd/lib/calendar'
import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'

import ProfileLayout from '../../layouts/ProfileLayout'

import TimeModal from '../../components/services/TimeModal'

import { fetchCreateAppointDate, fetchAppointedDates } from '../../api/appointments'

import { addAppointedDate, setAppointedDates } from '../../store/actions/appointments'

import useSearch from '../../hooks/useSearch'

import getServicesFromCurrentHospital from '../../utils/getServicesFromCurrentHospital'
import getDisabledDate from '../../utils/getDisabledDate'
import getAppointmentHours from '../../utils/getAppointmentHours'
import parseAppointedDate from '../../utils/parseAppointedDate'
import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'
import { IService } from '../../types/services'
import { IAppointmentHour } from '../../types'

const Busy: React.FC = () => {
  const dispatch = useDispatch()

  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { appointedDates } = useSelector((state: RootState) => state.appointments)

  const [calendarModalVisible, setCalendarModalVisible] = useState<boolean>(false)
  const [timeModalVisible, setTimeModalVisible] = useState<boolean>(false)
  const [appointmentHours, setAppointmentHours] = useState<IAppointmentHour[]>([])
  const [date, setDate] = useState<string>('')
  const [service, setService] = useState<IService | null>(null)

  const getColumnSearchProps = useSearch()

  const services = getServicesFromCurrentHospital(currentHospital)
  const dates = services.map(service => service.appointedDates.map(date => ({ name: service.name, date }))).flat().sort((a, b) => a.date < b.date ? 1 : -1)
  const schedule = currentHospital?.serviceList.find(list => list.category === service?.category)?.schedule

  const onChangeCalendarModal = (service: IService | null, visible: boolean) => {
    setService(service)
    setCalendarModalVisible(visible)
  }

  const onChangeTimeModal = (date: string, visible: boolean) => {
    setDate(date)
    setTimeModalVisible(visible)
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
    onChangeTimeModal(date.format('DD.MM.YYYY'), true)
    onChangeAppointmentHours(date, appointedDates)
  }

  const onCloseTimeModal = () => onChangeTimeModal('', false)

  const onSelectTime = (time: string) => {
    const appointedDate = parseAppointedDate(date, time)
    service && dispatch(fetchCreateAppointDate(service._id, appointedDate, () => {
      dispatch(addAppointedDate(appointedDate))
      onChangeAppointmentHours(moment(appointedDate), [...appointedDates, appointedDate])
    }))
    onCloseTimeModal()
    onCloseCalendarModal()
  }

  return (
    <ProfileLayout title="Занятое время" className="busy-time">
      <div className="busy-time__select">
        <Typography.Paragraph className="busy-time__label">Выберите услугу</Typography.Paragraph>
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
      </div>

      <Table
        dataSource={dates}
        loading={!currentHospital}
        size="middle"
        rowKey={record => record.date.toString()}
        // className="active-categories__table"
      >
        {/* <Column
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
        /> */}
        <Column title="Название" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
        <Column
          title="Дата"
          dataIndex="date"
          key="date"
          render={renderDate}
          sorter={(a: { date: Date }, b: { date: Date }) => a.date > b.date ? 1 : -1}
        />
        {/* <Column
          title="Количество услуг"
          dataIndex="services"
          key="services"
          render={(_, record: ICategory) => getServicesLength(record)}
          sorter={(a, b) => Number(getServicesLength(a)) - Number(getServicesLength(b))}
        /> */}
      </Table>

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
