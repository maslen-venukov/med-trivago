import React from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/NotFound'

import { IService } from '../../types/services'

interface IServiceProps extends IService {
  error: string
}

// TODO доделать страницу

const Service: React.FC<IServiceProps> = ({ name, price, category, workingHours, hospital, error }) => {
  return (
    <MainLayout>
      {!error ? (
        <Row className="service">
          <Col xs={18}>
            <Typography.Title level={3} className="service__title">{name}</Typography.Title>
            <p>{price}</p>
            <p>{hospital.name}</p>
            <p>{hospital.address}</p>
            <p>{hospital.phone}</p>
          </Col>
          <Col xs={6}>
            <Form layout="vertical" onFinish={values => console.log(values)}>
              <Form.Item
                label="Ваше имя"
                name="name"
                rules={[{ required: true, message: 'Пожалуйста введите ваше имя!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Номер телефона"
                name="phone"
                rules={[{ required: true, message: 'Пожалуйста введите ваш номер телефона!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item style={{}}>
                <Button type="primary" htmlType="submit">
                  Записаться
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ) : <NotFound />}
    </MainLayout>
  )
}

export default Service

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { id } = context.query
    const service = await axios.get(`http://localhost:5000/api/services/${id}`)
    return {
      props: {
        ...service.data.service
      }
    }
  } catch (e) {
    return {
      props: {
        error: e.response.data.message
      }
    }
  }
}