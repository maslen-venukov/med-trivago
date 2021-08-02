import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'antd/lib/button'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import SwiperCore, { Pagination, Autoplay } from 'swiper/core'

// SwiperCore.use([Pagination, Autoplay])

// interface ISlide {
//   src: string
//   alt: string
// }

// TODO сделать слайдер, когда будут готовы картинки

const Banner: React.FC = () => {
  // const slides: ISlide[] = [{
  //   src: '/banner.jpg',
  //   alt: 'Единая онлайн запись на диагностику'
  // }]

  return (
    <div className="banner">
      <div className="banner__content">
        <h1 className="banner__title">Единая онлайн запись на&nbsp;медицинскую диагностику</h1>
        <div className="banner__info">
          <ul className="banner__info-list list-reset">
            <li>Все виды диагностических исследований: МРТ, КТ, УЗИ, ЭКГ, ЭЭГ, холтер, денситометрия и др</li>
            <li>Запись во всех клиниках России 24 часа</li>
          </ul>
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
    </div>
    // <Swiper
    //   className="banner"
    //   slidesPerView={1}
    //   pagination={{ clickable: true }}
    //   autoplay={{ delay: 5000, disableOnInteraction: true }}
    //   spaceBetween={32}
    //   grabCursor
    //   loop
    // >
    //   {slides.map(slide => (
    //     <SwiperSlide key={Math.random()}>
    //       <Image
    //         src={slide.src}
    //         alt={slide.alt}
    //         width={984}
    //         height={400}
    //       />
    //     </SwiperSlide>
    //   ))}
    // </Swiper>
  )
}

export default Banner