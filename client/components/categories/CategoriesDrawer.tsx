import React from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import Button from 'antd/lib/button'
import UploadOutlined from '@ant-design/icons/UploadOutlined'

import CustomDrawer from '../app/CustomDrawer'

import { ICustomDrawerProps } from '../../types'
import { UploadFile } from 'antd/lib/upload/interface'

interface ICategoriesDrawerProps extends ICustomDrawerProps {
  fileList?: UploadFile[]
  setFileList?: (state: UploadFile[]) => void
}

const CategoriesDrawer: React.FC<ICategoriesDrawerProps> = ({ title, visible, submitText, form, fileList, setFileList, onFinish, onClose }) => {
  return (
    <CustomDrawer
      title={title}
      visible={visible}
      submitText={submitText}
      form={form}
      onFinish={onFinish}
      onClose={onClose}
    >
      <Form.Item
        label="Название"
        name="name"
        rules={[{ required: true, message: 'Пожалуйста введите название!' }]}
      >
        <Input placeholder="Название" />
      </Form.Item>

      <Form.Item
        label="Описание"
        name="description"
        rules={[{ required: true, message: 'Пожалуйста введите описание!' }]}
      >
        <Input.TextArea autoSize={{ minRows: 4 }} />
      </Form.Item>

      <Form.Item
        name="image"
        label="Изображение"
        valuePropName="file"
        rules={[{ required: true, message: 'Пожалуйста загрузите изображение!' }]}
      >
        <Upload listType="picture" maxCount={1} accept="image/*" fileList={fileList} onChange={image => setFileList && setFileList([image.file])}>
          <Button icon={<UploadOutlined />}>Загрузить</Button>
        </Upload>
      </Form.Item>
    </CustomDrawer>
  )
}

export default CategoriesDrawer