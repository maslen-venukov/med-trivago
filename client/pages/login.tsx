import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import MailOutlined from '@ant-design/icons/MailOutlined'
import LockOutlined from '@ant-design/icons/LockOutlined'

import MainLayout from '../layouts/MainLayout'

import { login } from '../api/user'

interface ILoginFormValues {
  email: string
  password: string
}

const Login: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [loging, setLoging] = useState<boolean>(false)

  const onLogin = (values: ILoginFormValues) => {
    const { email, password } = values
    const success = () => router.push('/profile')
    const error = () => setLoging(false)
    setLoging(true)
    dispatch(login(email, password, success, error))
  }

  return (
    <MainLayout title="Авторизация">
      <Form onFinish={onLogin} className="form form--login">
        <Form.Item
          name="email"
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
          rules={[{ required: true, message: 'Пожалуйста введите ваш пароль!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="form__icon" />}
            placeholder="Пароль"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loging} className="form__btn">
            {loging ? 'Вход...' : 'Войти'}
          </Button>
        </Form.Item>
      </Form>
    </MainLayout>
  )
}

export default Login
