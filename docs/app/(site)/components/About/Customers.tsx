// export default function Customers() {
//   return (
//     <section className="w-full py-20 bg-white">
//       <div className="container mx-auto px-4">
//         {/* Heading */}
//         <h2 className="text-3xl md:text-5xl font-bold w-fit max-w-[370px] mb-[90px] text-[#000000] text-left">
//           What Our Customers Say
//         </h2>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           <div className="">
//             {/* CARD 1 */}
//             <div className="relative bg-white border-3  border-[#D2466B] rounded-2xl p-8 pt-14 shadow-md">
//               {/* Profile Image */}
//               <div className="absolute top-[-1px] left-[50%] translate-y-[-50%] -translate-x-[50%] bg-white rounded-[20px]">
//                 <div className="relative p-8 before:content-['']
//          before:absolute before:h-3 before:w-3 before:bg-[#d2466b] before:rounded-full before:left-[-3px] before:top-1/2 before:-translate-y-1/2
//          after:absolute after:h-3 after:w-3 after:bg-[#d2466b] after:rounded-full after:right-[-3px] after:top-1/2 after:-translate-y-1/2">
//                   <div className="w-24 h-24 rounded-full p-[3px] bg-[#FD98B2]">
//                     <img
//                       src="/assets/about-imgs/Ellipse 9.svg"
//                       alt="user"
//                       className="w-full h-full rounded-full object-cover border-4 border-white"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="mt-6 text-center">
//                 <div className="absolute w-full left-[-22px] top-12">
//                   <div className="relative max-w-[250px] w-full">
//                     <img
//                       className="w-full"
//                       src="/assets/about-imgs/testimonials.svg"
//                     />
//                     <div className="absolute bottom-1.5 w-full">
//                       <p className=" text-white">Nupur Chauhan</p>
//                       <p className="text-[#FFFFFF] text-sm">- From Patna</p>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="mt-20 text-gray-700 leading-relaxed text-left text-lg">
//                   We hired Funtooks for our wedding reception, and they exceeded
//                   expectations! The elegant balloon centerpieces and entrance
//                   decor added a magical touch to our special day.
//                 </p>
//               </div>
//             </div>
//             {/* Stars */}
//             <div className="flex justify-center gap-1 mt-5 text-lg">
//               {Array(5)
//                 .fill(0)
//                 .map((_, i) => (
//                   <img
//                     key={i}
//                     src="/assets/about-imgs/icons/star.svg"
//                     alt="Star Icon"
//                     className={`w-5 h-5 ${i === 2 ? "w-6 h-6" : ""}`} // third star bigger
//                   />
//                 ))}
//             </div>
//           </div>

//           {/* CARD 2 */}
//           <div>
//             <div className="relative bg-white border-3  border-[#D2466B] rounded-2xl p-8 pt-14 shadow-md">
//               {/* Profile Image */}
//               <div className="absolute top-[-1px] left-[50%] translate-y-[-50%] -translate-x-[50%] bg-white rounded-[20px]">
//                 <div className="relative p-8 before:content-['']
//          before:absolute before:h-3 before:w-3 before:bg-[#d2466b] before:rounded-full before:left-[-3px] before:top-1/2 before:-translate-y-1/2
//          after:absolute after:h-3 after:w-3 after:bg-[#d2466b] after:rounded-full after:right-[-3px] after:top-1/2 after:-translate-y-1/2">
//                   <div className="w-24 h-24 rounded-full p-[3px] bg-[#FD98B2]">
//                     <img
//                       src="/assets/about-imgs/Ellipse 9.svg"
//                       alt="user"
//                       className="w-full h-full rounded-full object-cover border-4 border-white"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="mt-6 text-center">
//                 {/* <span className="inline-block bg-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-medium">
//                 Nupur Chauhan • Patna
//               </span> */}
//                 <div className="absolute w-full left-[-22px] top-12">
//                   <div className="relative max-w-[250px] w-full">
//                     <img
//                       className="w-full"
//                       src="/assets/about-imgs/testimonials.svg"
//                     />
//                     <div className="absolute bottom-1.5 w-full">
//                       <p className=" text-white">Dr. Shivani</p>
//                       <p className="text-[#FFFFFF] text-sm">- From Kolkata</p>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="mt-20 text-gray-700 leading-relaxed text-left text-lg">
//                   We hired Funtooks for our wedding reception, and they exceeded
//                   expectations! The elegant balloon centerpieces and entrance
//                   decor added a magical touch to our special day.
//                 </p>
//               </div>
//             </div>
//             {/* Stars */}
//             <div className="flex justify-center gap-1 mt-5 text-lg">
//               {Array(5)
//                 .fill(0)
//                 .map((_, i) => (
//                   <img
//                     key={i}
//                     src="/assets/about-imgs/icons/star.svg"
//                     alt="Star Icon"
//                     className={`w-5 h-5 ${i === 2 ? "w-6 h-6" : ""}`} // third star bigger
//                   />
//                 ))}
//             </div>
//           </div>

//           {/* CARD 3 */}
//           <div>
//             <div className="relative bg-white border-3  border-[#D2466B] rounded-2xl p-8 pt-14 shadow-md">
//               {/* Profile Image */}
//               <div className="absolute top-[-1px] left-[50%] translate-y-[-50%] -translate-x-[50%] bg-white rounded-[20px]">
//                 <div className="relative p-8 before:content-['']
//          before:absolute before:h-3 before:w-3 before:bg-[#d2466b] before:rounded-full before:left-[-3px] before:top-1/2 before:-translate-y-1/2
//          after:absolute after:h-3 after:w-3 after:bg-[#d2466b] after:rounded-full after:right-[-3px] after:top-1/2 after:-translate-y-1/2
//          ">
//                   <div className="w-24 h-24 rounded-full p-[3px] bg-[#FD98B2]">
//                     <img
//                       src="/assets/about-imgs/Ellipse 9.svg"
//                       alt="user"
//                       className="w-full h-full rounded-full object-cover border-4 border-white"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="mt-6 text-center">
//                 <div className="absolute w-full left-[-22px] top-12">
//                   <div className="relative max-w-[250px] w-full">
//                     <img
//                       className="w-full"
//                       src="/assets/about-imgs/testimonials.svg"
//                     />
//                     <div className="absolute bottom-1.5 w-full">
//                       <p className=" text-white">Shahil Thakur</p>
//                       <p className="text-[#FFFFFF] text-sm">- From Delhi</p>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="mt-20 text-gray-700 leading-relaxed text-left text-lg">
//                   We hired Funtooks for our wedding reception, and they exceeded
//                   expectations! The elegant balloon centerpieces and entrance
//                   decor added a magical touch to our special day.
//                 </p>
//               </div>
//             </div>
//             {/* Stars */}
//             <div className="flex justify-center gap-1 mt-5 text-lg">
//               {Array(5)
//                 .fill(0)
//                 .map((_, i) => (
//                   <img
//                     key={i}
//                     src="/assets/about-imgs/icons/star.svg"
//                     alt="Star Icon"
//                     className={`w-5 h-5 ${i === 2 ? "w-6 h-6" : ""}`} // third star bigger
//                   />
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// testimonials.ts

"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

/* =========================
   TESTIMONIAL DATA (JSON)
========================= */

const testimonials = [
  {
    name: "Nupur Chauhan",
    city: "Patna",
    image: "/assets/about-imgs/Ellipse 9.svg",
    message: `They are very professional. I contacted them for my wife bday celebration, they were supposed to come by
    7 pm but due to heavy traffic they didn't come by 9:30 pm. I thought they would not come, but they reached at 10 pm.
    Highly appreciated. They completed the entire work by 11:45 pm.
    The work is wonderful — can't expect this kind of service in Patna. Really thanks to them.`,
    rating: 5,
  },

  {
    name: "Dr. Shivani",
    city: "Kolkata",
    image: "/assets/about-imgs/Ellipse 9.svg",
    message:
      "I called them for my daughter's 1st bday as well as 2nd birthday...everytime the decoration was too good and everyone liked it..they are the best ballon decorators in Patna. fully satisfied and appreciated.",
    rating: 5,
  },
  {
    name: "Shahil Thakur",
    city: "Delhi",
    image: "/assets/about-imgs/Ellipse 9.svg",
    message:
      "I had organised balloon decoration for my daughter's birthday..I found the work to be very professional and good. Would recommend to everyone who want balloon decoration for family function at home and outside",
    rating: 5,
  },
  {
    name: "Shahil Thakur",
    city: "Delhi",
    image: "/assets/about-imgs/Ellipse 9.svg",
    message:
      "We hired Funtook for our wedding reception, and they exceeded expectations! The elegant balloon centerpieces and entrance decor added a magical touch to our special day. Everyone loved the setup!",
    rating: 5,
  },
];

/* =========================
   MAIN COMPONENT
========================= */

export default function Customers() {
  return (
    <section className="w-full sm:py-20 py-2 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold w-fit max-w-[370px] mb-[20px] text-[#000000] text-left">
          What Our Customers Say
        </h2>
        {/* <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          spaceBetween={40}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pt-15 !ps-5 sm:!ps-8"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <TestimonialCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper> */}

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          spaceBetween={40}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pt-15 !ps-5 sm:!ps-8 [&_.swiper-slide]:h-full"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index} className="h-full">
              <TestimonialCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}


/* =========================
   CARD COMPONENT
========================= */

function TestimonialCard({ data }: { data: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* CARD */}
      <div
        className="
          relative bg-white border-3 border-[#D2466B]
          rounded-2xl p-8 pt-14 shadow-md
          w-full mx-auto
          flex flex-col
          min-h-[375px]
        "
      >
        {/* Profile Image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px]">
          <div
            className="relative p-8
              before:absolute before:h-3 before:w-3 before:bg-[#d2466b] before:rounded-full before:left-[-3px] before:top-1/2 before:-translate-y-1/2
              after:absolute after:h-3 after:w-3 after:bg-[#d2466b] after:rounded-full after:right-[-3px] after:top-1/2 after:-translate-y-1/2"
          >
            <div className="w-24 h-24 rounded-full p-[3px] bg-[#FD98B2]">
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {/* <div className="mt-6 flex flex-col flex-1">
          <div className="relative max-w-[250px] w-full mx-auto mb-4">
            <img
              className="w-full"
              src="/assets/about-imgs/testimonials.svg"
              alt=""
            />
            <div className="absolute bottom-1.5 w-full text-center">
              <p className="text-white">{data.name}</p>
              <p className="text-white text-sm">- From {data.city}</p>
            </div>
          </div> */}

        <div className="mt-0 sm:mt-6 text-center">
          <div className="sm:absolute w-full 2xl:left-[-126px] xl:left-[-83px] lg:left-[-40px] md:left-[-60px] sm:left-[-182px] left-[-89px] top-12">
            <div className="relative max-w-[250px] w-full mx-auto">
              <img
                className="w-full"
                src="/assets/about-imgs/testimonials.svg"
                alt=""
              />
              <div className="absolute bottom-1.5 w-full">
                <p className="text-white">{data.name}</p>
                <p className="text-[#FFFFFF] text-sm">
                  - From {data.city}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {/* <p
            className={`text-gray-700 leading-relaxed text-left text-lg transition-all ${expanded ? "" : "line-clamp-5"
              }`}
          >
            {data.message}
          </p> */}

          {/* <p className="mt-5 sm:mt-20 text-gray-700 leading-relaxed text-left text-lg"> */}
          <p
            className={`mt-5 sm:mt-20 text-gray-700 leading-relaxed text-left text-lg ${expanded ? "" : "line-clamp-5"
              }`}
          >
            {data.message}
          </p>

          {/* Read More */}
          {data.message.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-[#D2466B] font-semibold text-sm self-start"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}

          {/* Push stars to bottom */}
          <div className="mt-auto" />
        </div>
      </div>

      {/* STARS */}
      <div className="flex justify-center gap-1 mt-5">
        {Array(data.rating)
          .fill(0)
          .map((_, i) => (
            <img
              key={i}
              src="/assets/about-imgs/icons/star.svg"
              alt="Star"
              className="w-5 h-5"
            />
          ))}
      </div>
    </div>
  );
}

