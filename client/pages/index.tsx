import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import message from 'antd/lib/message'

import MainLayout from '../layouts/MainLayout'

import { setLoggedOut } from '../store/actions/user'

import { RootState } from '../store/reducers'
import { ICategory } from '../types/categories'

interface IIndexProps {
  categories: ICategory[]
  error: string
}

const Index: React.FC<IIndexProps> = ({ categories, error }) => {
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
      {!error && categories.map(category => <p key={category._id}>{category.name}</p>)}
      index
    </MainLayout>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await axios.get('/api/categories')
    const { categories } = res.data
    return {
      props: {
        categories
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        error: 'Ошибка при загрузке категорий'
      }
    }
  }
}