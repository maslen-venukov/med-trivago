import React from 'react'
import Link from 'next/link'

import Typography from 'antd/lib/typography'

import MainLayout from '../layouts/MainLayout'

import { EMAIL } from '../constants'

const About: React.FC = () => {
  return (
    <MainLayout title="Сотрудничество">
      <section className="cooperation">
        <Typography.Title level={2} className="text-center">Единый портал онлайн записи на медицинскую диагностику приглашает к сотрудничеству клиники, ЛПУ, медицинские кабинеты, диагностические центры</Typography.Title>
        <Typography.Paragraph>Вас еще нет в едином портале записи на диагностику MeDi? – присоединяйтесь!</Typography.Paragraph>
        <Typography.Paragraph>Здесь потенциальные клиенты найдут Вашу услугу значительно быстрее!</Typography.Paragraph>
        <Typography.Paragraph>Какая цена? – регистрация на портале БЕСПЛАТНА! Получение заявок от клиентов - БЕСПЛАТНО!</Typography.Paragraph>
        <Typography.Paragraph>Никаких взносов не требуется!</Typography.Paragraph>
        <Typography.Paragraph>Подаете заявку на почту <Link href={`mailto:${EMAIL}`}><a>{EMAIL}</a></Link> – регистрируетесь – получаете доступ к приложению и автоматическому бронированию записи на ваши услуги – получаете клиентов!</Typography.Paragraph>
        <Typography.Paragraph>Как только человеку потребуется Ваша услуга, он выберет Ваше предложение на портале и у Вас автоматически пройдет запись на выбранное им время. Вы получите клиента, не задействовав при этом ни дополнительный персонал, ни вкладывая при этом в программное обеспечение, ни в рекламу! Здорово? Ваши коллеги из аналогичной сферы уже здесь, уже оценили.</Typography.Paragraph>
        <Typography.Paragraph>В чем выгода клиента? – удобство выбора услуги.</Typography.Paragraph>
        <Typography.Paragraph>Есть ли причины остаться в стороне, когда ваши конкуренты уже получают заявки с портала <Link href="/"><a>MeDi</a></Link>? – никаких.</Typography.Paragraph>
      </section>
    </MainLayout>
  )
}

export default About