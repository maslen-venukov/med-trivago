import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import message from 'antd/lib/message'

import MainLayout from '../layouts/MainLayout'

import Stats from '../components/home/Stats'
import Banner from '../components/home/Banner'
import Services from '../components/home/Services'

import { setLoggedOut } from '../store/actions/user'

import { RootState } from '../store/reducers'
import { ICategory } from '../types/categories'
import { IStats } from '../types'

interface IIndexProps {
  categories: ICategory[]
  stats: IStats
  error: string
}

const Index: React.FC<IIndexProps> = ({ categories, stats, error }) => {
  const dispatch = useDispatch()

  const { loggedOut } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    loggedOut && dispatch(setLoggedOut(false))
  }, [loggedOut, dispatch])

  useEffect(() => {
    error && message.error(error)
  }, [error])

  return (
    <MainLayout>
      <Banner />
      {!error && <Stats stats={stats} />}
      {!error && <Services categories={categories} />}
    </MainLayout>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await axios.all([
      axios.get('/api/categories'),
      axios.get('/api/stats/count')
    ])

    return {
      props: {
        categories: res[0].data.categories,
        stats: res[1].data
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        error: 'Ошибка при загрузке данных'
      }
    }
  }
}