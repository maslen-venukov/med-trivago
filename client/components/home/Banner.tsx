import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'antd/lib/button'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination, Autoplay } from 'swiper/core'

SwiperCore.use([Pagination, Autoplay])

const Banner: React.FC = () => {
  return (
    <Swiper
      className="banner"
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 7500, disableOnInteraction: true }}
      spaceBetween={32}
      autoHeight
      grabCursor
      loop
    >
      <SwiperSlide className="banner__item banner__item--1">
        <div className="banner__content">
          <h2 className="banner__title">Единая онлайн запись на&nbsp;медицинскую диагностику</h2>
          <div className="banner__info">
            <p>Все виды диагностических исследований: МРТ, КТ, УЗИ, ЭКГ, ЭЭГ, холтер, денситометрия и др</p>
            <p>Запись во всех клиниках России 24 часа</p>
          </div>
          <div>
            <Link href="/search">
              <a>
                <Button type="primary" className="banner__btn">Запишитесь сейчас</Button>
              </a>
            </Link>
          </div>
          <small className="banner__small">Имеются противопоказания, необходима консультация специалиста</small>
        </div>
        <div className="banner__img">
          <Image
            src="/banner.jpg"
            alt="Единая онлайн запись на медицинскую диагностику"
            width={540}
            height={400}
            loading="eager"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide className="banner__item banner__item--2">
        <div className="banner__content">
          <h2 className="banner__title">НДЦ-Оренбург <br /> МРТ диагностика, УЗИ</h2>
          <div className="banner__info">
            <p>Оренбург, ул. Народная, д. 8/1</p>
          </div>
          <small className="banner__small">Имеются противопоказания, необходима консультация специалиста</small>
        </div>
        <div className="banner__img">
          <Image
            src="/banner-2.jpg"
            alt="Единая онлайн запись на медицинскую диагностику"
            width={984}
            height={400}
            loading="eager"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  )
}

export default Banner