import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import Row from 'antd/lib/row'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import UserOutlined from '@ant-design/icons/UserOutlined'
import LockOutlined from '@ant-design/icons/LockOutlined'

import MainLayout from '../layouts/MainLayout'

import { logIn } from '../store/actions/user'

interface ILoginFormValues {
  email: string
  password: string
}

const Login: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const onLogin = (values: ILoginFormValues) => {
    const { email, password } = values
    dispatch(logIn(email, password, () => {
      router.push('/profile')
    }))
  }

  return (
    <MainLayout>
      <Row justify="center" align="middle" className="login">
        <Form onFinish={onLogin} className="login__form">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста введите ваш email!' },
              { type: 'email', message: 'Некорректный email' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="login__icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста введите ваш пароль!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="login__icon" />}
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login__btn">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </MainLayout>
  )
}

export default Login