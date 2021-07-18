import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import axios from 'axios'
import stringify from 'qs-stringify'

import List from 'antd/lib/list'
import Typography from 'antd/lib/typography'
import Button from 'antd/lib/button'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/app/NotFound'

import formatPrice from '../../utils/formatPrice'

import { IService } from '../../types/services'

interface ICompareProps {
  compared: IService[]
  error: string
}

const Compare: React.FC<ICompareProps> = ({ compared, error }) => {
  const [title, setTitle] = useState<string>('')

  const renderLinkToServicePage = (id: string, text: string) => (
    <Link href={`/services/${id}`}><a>{text}</a></Link>
  )

  useEffect(() => {
    !error && setTitle(`Цены на ${compared[0].name}`)
  }, [error])

  return (
    <MainLayout title={title}>
      {!error ? (
        <>
          <Typography.Title level={3}>{title}</Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={compared}
            renderItem={service => (
              <List.Item
                actions={[<Button type="primary">{renderLinkToServicePage(service._id, 'Подробнее')}</Button>]}
              >
                <List.Item.Meta
                  title={renderLinkToServicePage(service._id, service.hospital.name)}
                  description={`г. ${service.hospital.city}, ${service.hospital.address}`}
                />
                <Typography.Title type="success" level={5}>{formatPrice(service.price)}</Typography.Title>
              </List.Item>
            )}
          />
        </>
      ) : <NotFound />}
    </MainLayout>
  )
}

export default Compare

export const getServerSideProps: GetServerSideProps  = async context => {
  try {
    const serviceName = stringify({ serviceName: context.params?.serviceName?.toString() }).replace('serviceName=', '')
    const res = await axios.get(`/api/services/compare/${serviceName}`)
    return {
      props: {
        compared: res.data.compared
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        error: 'Ошибка при загрузке данных'
      }
    }
  }
}