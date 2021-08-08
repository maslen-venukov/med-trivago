import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'antd/lib/button'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination, Autoplay } from 'swiper/core'

SwiperCore.use([Pagination, Autoplay])

interface ISlide {
  src: string
  alt: string
}

// TODO сделать слайдер, когда будут готовы картинки

const Banner: React.FC = () => {
  // const slides: ISlide[] = [{
  //   src: '/banner.jpg',
  //   alt: 'Единая онлайн запись на диагностику'
  // }]

  return (
    // <div className="banner">
    //   <div className="banner__content">
    //     <h2 className="banner__title">Единая онлайн запись на&nbsp;медицинскую диагностику</h2>
    //     <div className="banner__info">
    //       <ul className="banner__info-list list-reset">
    //         <li>Все виды диагностических исследований: МРТ, КТ, УЗИ, ЭКГ, ЭЭГ, холтер, денситометрия и др</li>
    //         <li>Запись во всех клиниках России 24 часа</li>
    //       </ul>
    //     </div>
    //     <div>
    //       <Link href="/search">
    //         <a>
    //           <Button type="primary" className="banner__btn">Запишитесь сейчас</Button>
    //         </a>
    //       </Link>
    //     </div>
    //     <small className="banner__small">Имеются противопоказания, необходима консультация специалиста</small>
    //   </div>
    //   <div className="banner__img">
    //     <Image
    //       src="/banner.jpg"
    //       alt="Единая онлайн запись на медицинскую диагностику"
    //       width={540}
    //       height={400}
    //     />
    //   </div>
    // </div>
    <Swiper
      className="banner"
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: true }}
      spaceBetween={32}
      autoHeight
      grabCursor
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
          />
        </div>
      </SwiperSlide>
    </Swiper>
  )
}

export default Banner