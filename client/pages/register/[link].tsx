import React from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import Row from 'antd/lib/row'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import TimePicker from 'antd/lib/time-picker'
import MailOutlined from '@ant-design/icons/MailOutlined'
import LockOutlined from '@ant-design/icons/LockOutlined'
import UserOutlined from '@ant-design/icons/UserOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'
import PhoneOutlined from '@ant-design/icons/PhoneOutlined'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/app/NotFound'

import { registerHospital } from '../../api/hospitals'

import { IRegisterHospitalData } from '../../types/hospitals'

interface IRegisterByLinkProps {
  link: string | null
}

const RegisterByLink: React.FC<IRegisterByLinkProps> = ({ link }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const onRegister = (values: IRegisterHospitalData) => {
    if(!Array.isArray(values.schedule)) return
    const format = 'HH:mm'
    const schedule = {
      start: values.schedule[0].format(format),
      end: values.schedule[1].format(format)
    }
    const data = { ...values , schedule, link }
    dispatch(registerHospital(data, () => {
      router.push('/profile')
    }))
  }

  return (
    <MainLayout title="Регистрация">
      {link ? (
        <Row justify="center" align="middle" className="auth">
          <Form onFinish={onRegister} className="auth__form">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Пожалуйста введите ваш email!' },
                { type: 'email', message: 'Некорректный email' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="auth__icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              hasFeedback
              rules={[
                { required: true, message: 'Пожалуйста введите ваш пароль!' },
                {
                  pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
                  message: 'Пароль должен содержать не менее 6 символов, строчные и заглавные буквы латинского алфавита, хотя бы одно число и специальный символ!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="auth__icon" />}
                placeholder="Пароль"
              />
            </Form.Item>

            <Form.Item
              name="passwordCheck"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Пожалуйста введите ваш пароль еще раз!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'))
                  },
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="auth__icon" />}
                placeholder="Повторите пароль"
              />
            </Form.Item>

            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Пожалуйста введите наименование!' }]}
            >
              <Input
                prefix={<UserOutlined className="auth__icon" />}
                placeholder="Наименование"
              />
            </Form.Item>

            <Form.Item
              name="address"
              rules={[{ required: true, message: 'Пожалуйста введите адрес!' }]}
            >
              <Input
                prefix={<HomeOutlined className="auth__icon" />}
                placeholder="Адрес"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
            >
              <Input
                prefix={<PhoneOutlined className="auth__icon" />}
                placeholder="Телефон"
              />
            </Form.Item>

            <Form.Item
              name="schedule"
              rules={[{ required: true, message: 'Пожалуйста введите рабочее время!' }]}
            >
              <TimePicker.RangePicker format="HH:mm" className="auth__timepicker" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="auth__btn">
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>
        </Row>
      ) : <NotFound />}
    </MainLayout>
  )
}

export default RegisterByLink

export const getServerSideProps: GetServerSideProps  = async context => {
  try {
    const res = await axios.get(`/api/register-links/${context.query.link}`)
    const { link } = res.data
    return {
      props: {
        link
      }
    }
  } catch {
    return {
      props: {
        link: null
      }
    }
  }
}