import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import Card from 'antd/lib/card'

import { ICategory } from '../../types/categories'

import { API_URL } from '../../constants'
import { Tooltip } from 'antd'

interface IServicesProps {
  categories: ICategory[]
}

const Services: React.FC<IServicesProps> = ({ categories }) => {
  return categories.length ? <>
    <Typography.Title level={2}>Виды услуг</Typography.Title>
    <Row gutter={[16, 16]} className="services-types">
      {categories.map(category => (
        <Col key={category._id} md={8} sm={12} xs={24}>
          <Card
            hoverable
            cover={
              <Link href={`/search?cat=${category.name}`}>
                <a>
                  <Image
                    src={`${API_URL}/uploads/${category.image}`}
                    alt={`${category.name} ${category.description}`}
                    width={576}
                    height={324}
                  />
                </a>
              </Link>
            }
          >
            <Card.Meta
              title={<Tooltip title={category.name} placement="topLeft">{category.name}</Tooltip>}
              description={category.description}
            />
          </Card>
        </Col>
      ))}
    </Row>
  </> : null
}

export default Services