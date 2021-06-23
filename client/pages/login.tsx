import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import Row from 'antd/lib/row'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import MailOutlined from '@ant-design/icons/MailOutlined'
import LockOutlined from '@ant-design/icons/LockOutlined'

import MainLayout from '../layouts/MainLayout'

import { login } from '../store/actions/user'

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
      <Row justify="center" align="middle" className="auth">
        <Form onFinish={onLogin} className="auth__form">
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
            rules={[{ required: true, message: 'Пожалуйста введите ваш пароль!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="auth__icon" />}
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loging} className="auth__btn">
              {loging ? 'Вход...' : 'Войти'}
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </MainLayout>
  )
}

export default Login
