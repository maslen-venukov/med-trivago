import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import MailOutlined from '@ant-design/icons/MailOutlined'
import LockOutlined from '@ant-design/icons/LockOutlined'

import MainLayout from '../../layouts/MainLayout'

import NotFound from '../../components/app/NotFound'
import HospitalInfoForm from '../../components/hospitals/HospitalInfoForm'
import Agreement from '../../components/app/Agreement'

import { registerHospital } from '../../api/hospitals'

import formatSchedule from '../../utils/formatSchedule'

import { IRegisterHospitalData } from '../../types/hospitals'

interface IRegisterByLinkProps {
  link: string | null
}

const RegisterByLink: React.FC<IRegisterByLinkProps> = ({ link }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [registration, setRegistration] = useState<boolean>(false)

  const onRegister = (values: IRegisterHospitalData) => {
    if(!Array.isArray(values.schedule)) {
      return
    }
    const schedule = formatSchedule(values.schedule)
    const data = { ...values , schedule, link }
    const success = () => router.push('/profile')
    const error = () => setRegistration(false)
    setRegistration(true)
    dispatch(registerHospital(data, success, error))
  }

  return (
    <MainLayout title="Регистрация">
      {link ? (
        <Form
          onFinish={onRegister}
          layout="vertical"
          className="form"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Пожалуйста введите ваш email!' },
              { type: 'email', message: 'Некорректный email' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="form__icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
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
              prefix={<LockOutlined className="form__icon" />}
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item
            name="passwordCheck"
            label="Повторите пароль"
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
              prefix={<LockOutlined className="form__icon" />}
              placeholder="Повторите пароль"
            />
          </Form.Item>

          <HospitalInfoForm />

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={registration} className="form__btn">
              {registration ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </Form.Item>

          <Agreement />
        </Form>
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