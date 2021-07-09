import React from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'

import MainLayout from '../../layouts/MainLayout'

const Compare: React.FC = () => {
  return (
    <MainLayout>

    </MainLayout>
  )
}

export default Compare

export const getServerSideProps: GetServerSideProps  = async context => {
  try {
    const res = await axios.get(`/api/services/compare/${context.params?.serviceName}`)
    console.log(res.data)
    return {
      props: {

      }
    }
  } catch {
    return {
      props: {
        error: 'Ошибка при загрузке данных'
      }
    }
  }
}