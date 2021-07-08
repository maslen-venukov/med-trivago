import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import Typography from 'antd/lib/typography'
import Divider from 'antd/lib/divider'
import message from 'antd/lib/message'

import MainLayout from '../layouts/MainLayout'

import Contacts from '../components/home/Contacts'
import Stats from '../components/home/Stats'

import { setLoggedOut } from '../store/actions/user'

import { RootState } from '../store/reducers'
import { IStats } from '../types'

interface IIndexProps {
  stats: IStats
  error: string
}

const Index: React.FC<IIndexProps> = ({ stats, error }) => {
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
      <Typography.Title level={1} className="home-title">Медицинская Диагностика</Typography.Title>
      <Typography.Title type="secondary" level={4} className="home-subtitle">Сайт дистанционной записи на диагностику №1</Typography.Title>
      <Typography.Title level={5} className="quote">
        Диагностика достигла таких успехов, что <br />
        здоровых людей практически не осталось. <br />
        — Бертран Рассел.
      </Typography.Title>
      <Divider />
      {!error && <Stats stats={stats} />}
      <Typography.Paragraph><strong>Диагностика</strong> основывается на всестороннем и систематическом изучении больного, которое включает в себя сбор анамнеза, объективное исследование состояния организма, анализ результатов лабораторных исследований крови и различных выделений, рентгенологические исследования, графические методы, эндоскопию, биопсию и другие методы.</Typography.Paragraph>
      <Typography.Paragraph>Чем более точно и рано поставлен правильный диагноз – тем более эффективным будет лечение и скорым выздоровление человека. Поэтому информативность диагностики всегда была важна для врачей. Наука не стоит на месте, и методы лабораторной, функциональной и структурной диагностики постоянно совершенствуются, что качественно меняет подходы и результативность лечения самых разных патологий.</Typography.Paragraph>
      <Typography.Paragraph>Сегодня для нас становятся привычными даже самые революционные методы, о которых несколько десятков лет назад и не слышало медицинское сообщество. В лабораторные исследования внедряются микробиологические и экспресс-методики, не стоит на месте и инструментальная диагностика. В чем же сущность и преимущества новейших методов инструментальных исследований, которые при помощи новейшего медицинского оборудования помогают решить проблему ранней диагностики и не допустить развития тяжелых стадий тех или иных заболеваний.</Typography.Paragraph>
      <Typography.Paragraph>На ресурс предоставляет человеку возможность выбрать необходимое диагностическое исследование, возможность записаться на прием в один клик без очередей.</Typography.Paragraph>
      <Typography.Paragraph>Услуги предоставляются квалифицированными медицинскими учреждениями, которые имеют все необходимые лицензии и проходят тщательный отбор.</Typography.Paragraph>
      <Typography.Paragraph>БУДЬТЕ ЗДОРОВЫ</Typography.Paragraph>
      <Typography.Paragraph>С Уважением ООО «МК «Новые Технологии»</Typography.Paragraph>
      <Typography.Title level={5} className="quote">
        Цена здоровья ощущается после болезни <br />
        — Денис Иванович Фонвизин
      </Typography.Title>
      <Divider />
      <Contacts />
    </MainLayout>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await axios.get('/api/stats/count')
    return {
      props: {
        stats: res.data
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