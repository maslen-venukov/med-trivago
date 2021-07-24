import React from 'react'
import Image from 'next/image'
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
  //   src: '/banner.png',
  //   alt: 'Единая онлайн запись на диагностику'
  // }]

  return (
    <div className="banner">
      <Image
        src="/banner.png"
        alt="Единая онлайн запись на диагностику"
        width={984}
        height={400}
      />
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