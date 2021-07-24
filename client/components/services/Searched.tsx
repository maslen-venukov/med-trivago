import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import queryStringify from 'qs-stringify'

import Typography from 'antd/lib/typography'
import Card from 'antd/lib/card'
import Divider from 'antd/lib/divider'
import Tooltip from 'antd/lib/tooltip'

import formatPrice from '../../utils/formatPrice'

import { ISearchResult } from '../../types/search'
import { ICategory } from '../../types/categories'
import { RootState } from '../../store/reducers'

interface ISearchedProps extends ISearchResult {
  categories: ICategory[]
}

const Searched: React.FC<ISearchedProps> = ({ name, min, services, categories }) => {
  const { filters } = useSelector((state: RootState) => state.search)

  const first = services.slice(0, 3)
  const count = `в ${services.length} клиник${Number(services.length.toString().split('').pop()) === 1 ? 'е' : 'ах'}`
  const category = categories.find(category => category._id === services[0].category)

  const query = queryStringify(
    Object.entries(filters).reduce((acc, [key, value]) => (
      value ? { [key]: value, ...acc } : acc
    ), {})
  )

  return (
    <Card
      hoverable
      className="service"
    >
      <Link href={`/compare/${name}${query && `?${query}`}`}>
        <a className="service__info">
          <Typography.Text type="secondary">
            <small>{category?.name}</small>
          </Typography.Text>
          <Typography.Title level={5}>{name}</Typography.Title>
          <Typography.Paragraph type="secondary" className="service__italic">Цены от</Typography.Paragraph>
          <Typography.Title level={5}>{formatPrice(min)}</Typography.Title>
          <Typography.Paragraph type="secondary" className="service__italic">{count}</Typography.Paragraph>
        </a>
      </Link>
      <Divider className="service__divider" />
      <ul className="service__list list-reset">
        {first.map(service => (
          <li key={service._id}>
            <Link href={`/services/${service._id}`}>
              <a className="service__link">
                <Typography.Text type="success">{formatPrice(service.price)}</Typography.Text>
                <Tooltip title={service.hospital.name}>
                  <Typography.Text className="service__hospital">
                    {service.hospital.name}
                  </Typography.Text>
                </Tooltip>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default Searched