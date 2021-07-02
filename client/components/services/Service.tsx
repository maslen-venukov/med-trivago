import React from 'react'
import Link from 'next/link'

import List from 'antd/lib/list'
import Typography from 'antd/lib/typography'
import HomeTwoTone from '@ant-design/icons/HomeTwoTone'
import PhoneTwoTone from '@ant-design/icons/PhoneTwoTone'

import { IService } from '../../types/services'

const Service: React.FC<IService> = ({ _id, name, price, hospital }) => {
  return (
    <List.Item key={_id}>
      <Link href={`/services/${_id}`}>
        <a className="services__link">
          <Typography.Title level={4}>
            {name} — <Typography.Text type="success">{price} ₽</Typography.Text>
          </Typography.Title>

          <Typography.Title level={5}>
            {hospital.name}
          </Typography.Title>

          <Typography.Paragraph>
            <HomeTwoTone className="icon" /> {hospital.address}
          </Typography.Paragraph>

          <Typography.Paragraph className="services__phone">
            <PhoneTwoTone className="icon mirrored" /> {hospital.phone}
          </Typography.Paragraph>
        </a>
      </Link>
    </List.Item>
  )
}

export default Service
