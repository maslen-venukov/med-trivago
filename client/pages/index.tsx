import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'

import message from 'antd/lib/message'

import MainLayout from '../layouts/MainLayout'

import { ICategory } from '../types/categories'

interface IIndexProps {
  categories: ICategory[]
  error: string
}

const Index: React.FC<IIndexProps> = ({ categories, error }) => {
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
    const { data } = await axios.get('http://localhost:5000/api/categories')
    const { categories } = data
    return {
      props: {
        categories
      }
    }
  } catch {
    return {
      props: {
        error: 'Ошибка при загрузке категорий'
      }
    }
  }
}