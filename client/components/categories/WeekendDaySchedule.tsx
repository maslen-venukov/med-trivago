import React from 'react'

import Form from 'antd/lib/form'
import TimePicker from 'antd/lib/time-picker'
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'

import { Day, IWeekendState } from '../../pages/profile/active-categories'

interface IWeekendDayScheduleProps {
  name: Day
  label: string
  message: string
  state: IWeekendState
  setState: (state: IWeekendState) => void
}

const WeekendDaySchedule: React.FC<IWeekendDayScheduleProps> = ({ label, name, message, state, setState }) => {
  const onChange = (e: CheckboxChangeEvent) => {
    setState({ ...state, [name]: e.target.checked })
  }

  return (
    <>
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: !state[name], message }]}
        style={{ marginBottom: 8 }}
      >
        <TimePicker.RangePicker disabled={state[name]} format="HH:mm" minuteStep={30} />
      </Form.Item>

      <Form.Item name={`${name}Weekend`} valuePropName="checked">
        <Checkbox
          checked={state[name] || false}
          onChange={onChange}
        >
          Выходной
        </Checkbox>
      </Form.Item>
    </>
  )
}

export default WeekendDaySchedule
