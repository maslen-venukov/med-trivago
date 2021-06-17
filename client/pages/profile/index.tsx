import Typography from 'antd/lib/typography'
import React from 'react'

import ProfileLayout from '../../layouts/ProfileLayout'

const Profile: React.FC = () => {
  return (
    <ProfileLayout>
      <Typography.Title level={5}>
        Добро пожаловать в ваш профиль
      </Typography.Title>
      <Typography.Title level={5}>
        Выберите один из пунктов меню
      </Typography.Title>
    </ProfileLayout>
  )
}

export default Profile