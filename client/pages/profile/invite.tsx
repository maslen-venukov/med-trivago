import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'

import Typography from 'antd/lib/typography'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'

import ProfileLayout from '../../layouts/ProfileLayout'

import { fetchCreateRegisterLink, fetchRegisterLinks, fetchRemoveRegisterLink } from '../../api/registerLinks'

import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'
import { IRegisterLink } from '../../types/registerLinks'

interface IInviteFormvalues {
  email: string
}

const Invite: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { registerLinks, loading } = useSelector((state: RootState) => state.registerLinks)

  const [sending, setSending] = useState<boolean>(false)

  const onInvite = (values: IInviteFormvalues) => {
    setSending(true)
    dispatch(fetchCreateRegisterLink(values.email, () => {
      setSending(false)
    }))
    form.resetFields()
  }

  const onCancel = (id: string) => dispatch(fetchRemoveRegisterLink(id))

  const renderLink = (link: string) => (
    <Link href={`/register/${link}`}>
      <a target="_blank" rel="noreferrer">{link}</a>
    </Link>
  )

  useEffect(() => {
    dispatch(fetchRegisterLinks())
  }, [dispatch])

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
            loading={sending}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </Button>
        </Form.Item>
      </Form>

      <Typography.Title level={5} className="invite__title">
        Список отправленных приглашений
      </Typography.Title>

      <Table
        dataSource={registerLinks}
        loading={loading}
        size="middle"
        rowKey={record => record._id}
      >
        <Column title="Ссылка" dataIndex="link" key="link" render={renderLink} />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Дата отправки" dataIndex="createdAt" key="createdAt" render={renderDate} />
        <Column
          title="Действия"
          key="action"
          render={(_, record: IRegisterLink) => (
            <Popconfirm
              title="Вы действительно хотите отменить приглашение?"
              onConfirm={() => onCancel(record._id)}
              okText="Да"
              cancelText="Нет"
            >
              <Typography.Text type="danger" className="cursor-pointer">
                Отменить
              </Typography.Text>
            </Popconfirm>
          )}
        />
      </Table>
    </ProfileLayout>
  )
}

export default Invite