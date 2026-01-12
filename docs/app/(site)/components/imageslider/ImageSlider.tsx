"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import Image from "next/image";
const slides = [
  "/assets/home/heroslider/banerimages_2.webp",
  "/assets/home/heroslider/banerimages_1.webp",
  "/assets/home/heroslider/banerimages_2.webp",
];

// duplicate
const swiperSlides = [...slides, ...slides];

export default function HeroSlider() {
  return (
    <div className="container max-w-[1250px] mx-auto py-0 sm:py-8 px-4">
      <div
        className="swiper-container w-full md:[&_.swiper-slide]:flex! md:[&_.swiper-slide]:items-center md:[&_.swiper-slide]:min-h-[400px] md:[&_.swiper-wrapper]:min-h-[450px] md:[&_.swiper-slide-next_img]:absolute md:[&_.swiper-slide-next_img]:left-1/2 md:[&_.swiper-slide-next_img]:-translate-x-1/2 md:[&_.swiper-slide-next_img]:w-[150%] md:[&_.swiper-slide-next_img]:max-w-none md:[&_.swiper-slide-next_img]:z-9 [&_.swiper-slide_img]:transition-[width] [&_.swiper-slide_img]:duration-400 [&_.swiper-slide_img]:ease-in-out"
      >
        <Swiper
        className="!pt-0 sm:!pt-[80px] !pb-0 sm:!pb-[30px]"
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          navigation={false}
          pagination={{ clickable: true }}
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 3,
            },
            1560: {
              slidesPerView: 3,
            },
          }}
        >
          {swiperSlides.map((src, index) => (
            <SwiperSlide key={index} className="relative w-full h-50">
              <Image
                src={src}
                alt={`hero-${index}`}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
                width={1000}
                height={1000}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
