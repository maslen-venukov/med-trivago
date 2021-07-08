import React from 'react'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Statistic from 'antd/lib/statistic'
import EditTwoTone from '@ant-design/icons/EditTwoTone'
import AlertTwoTone from '@ant-design/icons/AlertTwoTone'
import MedicineBoxTwoTone from '@ant-design/icons/MedicineBoxTwoTone'

import { IStats } from '../../types'

interface IStatsProps {
  stats: IStats
}

interface IStat {
  label: string
  value: number
  icon: React.ReactNode
}

const Stats: React.FC<IStatsProps> = ({ stats }) => {
  const items: IStat[] = [
    {
      label: 'Записей на прием',
      value: stats.appointments,
      icon: <EditTwoTone />
    },
    {
      label: 'Услуг',
      value: stats.services,
      icon: <AlertTwoTone />
    },
    {
      label: 'Клиник',
      value: stats.hospitals,
      icon: <MedicineBoxTwoTone />
    },
  ]

  return (
    <Row gutter={16} className="stats">
      {items.map(item => (
        <Col key={item.label} span={8} className="stats__item">
          <Statistic title={item.label} value={item.value} prefix={item.icon} />
        </Col>
      ))}
    </Row>
  )
}

export default Stats