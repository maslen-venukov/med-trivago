import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

import List from 'antd/lib/list'
import Typography from 'antd/lib/typography'
import Button from 'antd/lib/button'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/app/NotFound'

import { getCompareResult } from '../../api'

import formatPrice from '../../utils/formatPrice'

import { IService } from '../../types/services'

interface ICompareProps {
  compared?: IService[]
  error?: string
}

const Compare: React.FC<ICompareProps> = ({ compared, error }) => {
  const [title, setTitle] = useState<string>('')

  const renderLinkToServicePage = (id: string, text: string) => (
    <Link href={`/services/${id}`}><a>{text}</a></Link>
  )

  useEffect(() => {
    !error && compared && setTitle(`Цены на ${compared[0].name}`)
  }, [error])

  return (
    <MainLayout title={title} error={error}>
      {!error && compared ? (
        <div className="compare">
          <Typography.Title level={3} className="compare__title">{title}</Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={compared}
            renderItem={service => (
              <List.Item
                actions={[<Button type="primary">{renderLinkToServicePage(service._id, 'Записаться')}</Button>]}
                className="compare__item"
              >
                <List.Item.Meta
                  title={renderLinkToServicePage(service._id, service.hospital.name)}
                  description={`г. ${service.hospital.city}, ${service.hospital.address}`}
                />
                <Typography.Title type="success" level={5} className="compare__price">
                  {formatPrice(service.price)}
                </Typography.Title>
              </List.Item>
            )}
          />
        </div>
      ) : <NotFound />}
    </MainLayout>
  )
}

export default Compare

export const getServerSideProps: GetServerSideProps = getCompareResult