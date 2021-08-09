import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useDispatch, useSelector } from 'react-redux'

import MainLayout from '../layouts/MainLayout'

import Stats from '../components/home/Stats'
import Banner from '../components/home/Banner'
import Services from '../components/home/Services'

import { setLoggedOut } from '../store/actions/user'

import { getIndexPageData } from '../api'

import { RootState } from '../store/reducers'
import { ICategory } from '../types/categories'
import { IStats } from '../types'

export interface IIndexProps {
  categories?: ICategory[]
  stats?: IStats
  error?: string
}

const Index: React.FC<IIndexProps> = ({ categories, stats, error }) => {
  const dispatch = useDispatch()

  const { loggedOut } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    loggedOut && dispatch(setLoggedOut(false))
  }, [loggedOut, dispatch])

  console.log(error)

  return (
    <MainLayout error={error}>
      <Banner />
      {!error && <>
        {stats && <Stats stats={stats} />}
        {categories && <Services categories={categories} />}
      </>}
    </MainLayout>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps = getIndexPageData