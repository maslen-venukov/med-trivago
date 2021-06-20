import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Typography from 'antd/lib/typography'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import ProfileLayout from '../../layouts/ProfileLayout'

import { inviteExecutor } from '../../store/actions/hospitals'

import { RootState } from '../../store/reducers'

interface IInviteFormvalues {
  email: string
}

const Invite: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { token } = useSelector((state: RootState) => state.user)
  const { loading } = useSelector((state: RootState) => state.hospitals)

  const onInvite = (values: IInviteFormvalues) => {
    token && dispatch(inviteExecutor(values.email, token))
    form.resetFields()
  }

  return (
    <ProfileLayout title="Добавить исполнителя" className="invite">
      <Typography.Title level={5} className="invite__title">
        Чтобы отправить медицинскому учреждению письмо с приглашением, <br /> введите email и нажмите кнпоку «Отправить»
      </Typography.Title>
      <Form
        onFinish={onInvite}
        form={form}
        layout="vertical"
        className="invite__form"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Пожалуйста введите email!' },
            { type: 'email', message: 'Некорректный email' }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {loading ? 'Отправка' : 'Отправить'}
          </Button>
        </Form.Item>
      </Form>
    </ProfileLayout>
  )
}

export default Invite