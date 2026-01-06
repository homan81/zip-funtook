"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function ImageSliderWithZoom() {
  const swiperRef = useRef<any>(null); // <--- FIX (useRef instead of state)
  const [active, setActive] = useState(0);

  const images = [
    "/images/bigimage.svg",
    "/images/smallimg.svg",
    "/images/smallimg1.svg",
    "/images/smallimg2.svg",
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        {/* MAIN IMAGE SWIPER */}
        <div className="relative w-full max-w-[1200px] mx-auto flex flex-col p-1 sm:p-5">
          {/* LEFT ARROW */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-10
                 w-8 h-8 sm:w-10 sm:h-10
                 flex items-center justify-center
                 rounded-full bg-white/90 shadow
                 hover:bg-white transition"
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-10
                 w-8 h-8 sm:w-10 sm:h-10
                 flex items-center justify-center
                 rounded-full bg-white/90 shadow
                 hover:bg-white transition"
          >
            ›
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={false}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActive(swiper.activeIndex)}
            className="w-[308px] sm:w-[336px] md:w-[364px] lg:w-[442px]
                 h-auto rounded-xl overflow-hidden mx-auto"
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <ZoomImage src={src} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex gap-4">{/* thumbnails here */}</div>
        </div>
      </div>

      {/* STATIC THUMBNAILS */}
      <div className="hidden lg:flex gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => {
              setActive(i);
              swiperRef.current?.slideTo(i, 0);
            }}
            className={`w-25 h-25 rounded-xl overflow-hidden cursor-pointer border
            ${active === i ? "border-red-500" : "border-gray-300"}`}
          >
            <img
              src={src}
              className="w-full h-full object-cover transition-none!"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——————————————————————————————————
            ZOOM COMPONENT
—————————————————————————————————— */
function ZoomImage({ src }: { src: string }) {
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      className="w-full h-full overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMove}
    >
      <img
        src={src}
        className="w-full h-full object-cover"
        style={{
          transformOrigin: `${pos.x}% ${pos.y}%`,
          transform: zoom ? "scale(2)" : "scale(1)",
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );
}
