import React from 'react'

import MainLayout from '../layouts/MainLayout'

import NotFound from '../components/app/NotFound'

const Error404 = () => {
  return (
    <MainLayout title="Страница не найдена">
      <NotFound />
    </MainLayout>
  )
}

export default Error404
