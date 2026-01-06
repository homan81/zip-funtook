"use client";
import Image from "next/image";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { Phone } from "lucide-react";
import DeliveryDetails from "../components/DeliveryDetails";
import DeliveryForm from "../components/DeliveryForm";
import { useState } from "react";
import { X } from "lucide-react";

export default function NewsletterSection() {
  const [open, setOpen] = useState(true);

  const newsletterData = {
    sidebar: [
      { label: "Introduction", id: "introduction" },
      { label: "The Emotional Impact of Balloons", id: "emotional-impact" },
      { label: "Versatility in Themes and Styles", id: "versatility" },
      { label: "Budget-Friendly Decoration Option", id: "budget-friendly" },
      { label: "Customization", id: "customization" },
    ],

    sections: [
      {
        id: "introduction",
        title: "Introduction",
        image: "/assets/home/cake-girl.svg",
        description:
          "Balloon decoration is the heart of celebrations because it brings color, joy, and a warm welcoming vibe to any event.",
        points: [
          { title: "Joyful Atmosphere", text: "Bright colors lift mood." },
          { title: "Versatile Themes", text: "Works for all events." },
          { title: "Memorable Moments", text: "Creates photo-worthy scenes." },
        ],
      },
      {
        id: "emotional-impact",
        title: "The Emotional Impact of Balloons",
        image: "/assets/home/cake-girl.svg",
        description:
          "Balloon decoration is the heart of celebrations because it brings color, joy, and a warm welcoming vibe to any event.",
        points: [
          { title: "Joyful Atmosphere", text: "Bright colors lift mood." },
          { title: "Versatile Themes", text: "Works for all events." },
          { title: "Memorable Moments", text: "Creates photo-worthy scenes." },
        ],
      },
      {
        id: "versatility",
        title: "Versatility in Themes and Styles",
        image: "/assets/home/cake-girl.svg",
        description:
          "Balloon decoration is the heart of celebrations because it brings color, joy, and a warm welcoming vibe to any event.",
        points: [
          { title: "Joyful Atmosphere", text: "Bright colors lift mood." },
          { title: "Versatile Themes", text: "Works for all events." },
          { title: "Memorable Moments", text: "Creates photo-worthy scenes." },
        ],
      },
      {
        id: "budget-friendly",
        title: "Budget-Friendly Decoration Option",
        image: "/assets/home/cake-girl.svg",
        description:
          "Balloon decoration is the heart of celebrations because it brings color, joy, and a warm welcoming vibe to any event.",
        points: [
          { title: "Joyful Atmosphere", text: "Bright colors lift mood." },
          { title: "Versatile Themes", text: "Works for all events." },
          { title: "Memorable Moments", text: "Creates photo-worthy scenes." },
        ],
      },
      {
        id: "customization",
        title: "Customization",
        image: "/assets/home/cake-girl.svg",
        description:
          "Balloon decoration is the heart of celebrations because it brings color, joy, and a warm welcoming vibe to any event.",
        points: [
          { title: "Joyful Atmosphere", text: "Bright colors lift mood." },
          { title: "Versatile Themes", text: "Works for all events." },
          { title: "Memorable Moments", text: "Creates photo-worthy scenes." },
        ],
      },
    ],
  };

  const blogCards = [
    {
      image: "/assets/home/card-img.svg",
      category: "Birth Decoration",
      title: "Why Balloon Decoration Is The Heart of Every Celebrations",
      description:
        "Balloon decoration brings instant joy, color, and life to any event. Whether it’s a birthday...",
      authorImage: "/assets/home/card-girl.svg",
      authorName: "Ruhi Sinha",
      authorRole: "Senior Mentor | Decorations Specialist",
    },
    {
      image: "/assets/home/card-img.svg",
      category: "Birth Decoration",
      title: "Why Balloon Decoration Is The Heart of Every Celebrations",
      description:
        "Balloon decoration brings instant joy, color, and life to any event. Whether it’s a birthday...",
      authorImage: "/assets/home/card-girl.svg",
      authorName: "Ruhi Sinha",
      authorRole: "Senior Mentor | Decorations Specialist",
    },
    {
      image: "/assets/home/card-img.svg",
      category: "Birth Decoration",
      title: "Why Balloon Decoration Is The Heart of Every Celebrations",
      description:
        "Balloon decoration brings instant joy, color, and life to any event. Whether it’s a birthday...",
      authorImage: "/assets/home/card-girl.svg",
      authorName: "Ruhi Sinha",
      authorRole: "Senior Mentor | Decorations Specialist",
    },
  ];

  return (
    <div>
      <div className="container mx-auto px-4 py-12  bg-[#E6E6E6] md:bg-transparent">
        <div className="w-full bg-[#FFF7F8] px-4 py-5 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 sm:gap-[20px] gap:3">
            {/* LEFT SECTION */}
            <div className="flex flex-col gap-5 sm:gap-8 order-2 lg:order-1">
              {/* Category */}
              <p className="text-sm hidden md:block font-medium text-[#FC6E88] mt-4 sm:mt-0 tracking-wider">
                BIRTHDAY DECORATION
              </p>

              {/* Heading */}
              <h1 className="text-[32px] sm:text-[40px] lg:text-[40px] font-medium mt-4 sm:mt-0 leading-tight">
                Why Balloon Decoration Is The Heart of Every Celebrations
              </h1>

              <button className="w-full sm:w-fit bg-[#FC6E88] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#ff5474] transition">
                Explore Funtook today
              </button>

              <div className="flex sm:flex-col flex-row gap-[15px]">

                {/* AUTHOR INFO */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Image
                    src="/assets/home/card-girl.svg" // Replace with your image path
                    alt="Author"
                    width={100}
                    height={1000}
                    className="w-[200px] sm:w-[48px] h-auto rounded-full"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-row items-center gap-[25px] text-sm text-[#585858] flex-wrap">
                  <span className="font-medium">Ruhi Sinha</span>

                  <span className="flex flex-row justify-between items-center gap-1">
                    <span className="w-2 h-2 bg-[#585858] rounded-full"></span>
                    Senior Mentor|Decorations Specialist
                  </span>

                  <span className="flex flex-row items-center gap-1">
                    <span className="w-2 h-2 bg-[#585858] rounded-full"></span>
                    September 7, 2025
                  </span>
                </div>

              </div>

            </div>

            {/* RIGHT SECTION - IMAGE CARD */}
            <div className="bg-white rounded-[30px] d p-0 overflow-hidden order-1 lg:order-2">
              <p className="block lg:hidden md:hidden text-sm font-medium text-[#FC6E88] mt-4 sm:mt-0 mb-4 sm:mb-0 tracking-wider">
                BIRTHDAY DECORATION
              </p>
              <Image
                src="/assets/home/card-img.svg" // Replace with your blog card image
                alt="Blog Banner"
                width={700}
                height={450}
                className="w-full h-auto rounded-[30px]"
              />
            </div>
          </div>
        </div>

        <h2 className="text-[22px] font-medium mt-4 sm:mt-0 mb-4">Table of Contents</h2>

        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 mb-[38px]">

          {/* Sidebar */}
          <aside className="w-full md:w-64 p-4 bg-[#FFF0F4] shadow-md sticky md:top-0 max-h-[250px] md:h-screen overflow-y-auto">
            <ul className="space-y-2 text-gray-700">
              {newsletterData.sidebar.map((item) => (
                <li
                  key={item.id}
                  className="p-2 rounded cursor-pointer hover:bg-[#FFCDDB]"
                  onClick={() =>
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-8 space-y-16">
            {newsletterData.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="space-y-4"
              >
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold">
                  {section.title}
                </h1>

                {/* Image */}
                <div>
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={1000}
                    height={1000}
                    className="rounded-lg w-full h-auto"
                  />
                </div>

                {/* Description */}
                <p className="text-gray-700">
                  {section.description}
                </p>

                {/* Points */}
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {section.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}:</strong> {point.text}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </main>
        </div>

        <div>
          <h2 className="text-4xl font-bold my-5">Related Posts</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogCards.map((card, index) => (
              <div
                key={index}
                className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent"
              >
                {/* Card Image */}
                <Image
                  src={card.image}
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />

                {/* Category */}
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  {card.category}
                </div>

                {/* Title */}
                <p className="text-lg font-medium">
                  {card.title}
                </p>

                {/* Description */}
                <p className="text-sm font-normal">
                  {card.description}
                </p>

                {/* Author */}
                <div className="mt-2">
                  <Image
                    src={card.authorImage}
                    alt="author"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">
                    {card.authorName}
                  </p>
                  <p className="text-sm font-normal">
                    {card.authorRole}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <section>
        <div className="bg-[#B189A3] text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-10 md:mt-[35px] mt-0">
          <h2 className="font-medium text-[20px] sm:text-4xl md:text-5xl lg:text-6xl">
            <span
              className="
      bg-white rounded-full py-1 sm:py-2.5 
      px-3 sm:px-6 md:px-8 
      inline-block
    "
            >
              Maximize Productivity by 30%
            </span>{" "}
            <span className="text-white max-w-[135px] block mx-auto sm:max-w-full sm:inline ">
              with FUNTOOK
            </span>
          </h2>

          <button className="bg-[linear-gradient(90deg,rgba(252,110,136,1)_53%,rgba(255,6,6,1)_87%)] mt-6 sm:mt-10 px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium text-white">
            Get Started
          </button>
        </div>
      </section>


      <div className="">
        <DeliveryDetails />
      </div>

      <div>
        <DeliveryForm isOpen={open} onClose={() => setOpen(false)} />
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className=" w-full max-w-5xl rounded-2xl p-5 bg-pink-500 overflow-hidden shadow-xl flex flex-col md:flex-row">
          {/* LEFT SECTION */}
          <div className="w-full md:w-1/3  text-white p-6 space-y-6">
            {/* Brand section */}
            <div className="flex items-center gap-3">
              <div>
                <Image
                  src="/assets/home/funtook-bg.svg"
                  alt="Introduction"
                  width={1000}
                  height={1000}
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div>
                <h2 className="font-bold text-lg">FUNTOOK</h2>
                <p className="text-sm opacity-80">Razorpay Trusted Business</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white text-black rounded-xl p-4">
              <p className="text-sm">Price Summary</p>
              <p className="text-2xl font-semibold mt-2">₹ 4,765</p>
            </div>

            <div className="bg-[#FFFFFF] text-black rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-black" />
                <p className="text-sm">Using as +916350607808</p>
              </div>

              <span className="text-2xl text-[#FC768E]">›</span>
            </div>

            {/* Offer */}
            <div className="text-black bg-[#ECFFE5] rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm ml-5">Offer on UPI, AUBL & more</p>
              <span className="text-2xl">›</span>
            </div>
          </div>

          {/* RIGHT SECTION */}
          {/* <div className="w-full md:w-2/3 bg-white p-6 rounded-2xl relative">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="grid grid-cols-1 gap-3">
              <div className="border rounded-xl p-4 flex justify-between items-center">
                <p className="font-medium">UPI</p>
                <span className="text-green-600 text-sm">3 Offers</span>
              </div>

              <div className="border rounded-xl p-4 flex justify-between items-center">
                <p className="font-medium">Cards</p>
                <span className="text-green-600 text-sm">
                  Up to 1.5% saving
                </span>
              </div>

              <div className="border rounded-xl p-4 flex justify-between items-center">
                <p className="font-medium">EMI</p>
                <span className="text-green-600 text-sm">2.5% Cashback</span>
              </div>

              <div className="border rounded-xl p-4 flex justify-between items-center">
                <p className="font-medium">Netbanking</p>
              </div>

              <div className="border rounded-xl p-4 flex justify-between items-center">
                <p className="font-medium">Wallet</p>
                <span className="text-green-600 text-sm">2.5% Cashback</span>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-semibold">UPI QR</h3>

            <div className="border rounded-xl p-4 mt-3 flex gap-4">
              <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg"></div>

              <div className="flex flex-col justify-between">
                <button className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                  Refresh QR
                </button>
                <p className="text-sm text-green-600">4 Offers</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              By proceeding, I agree to Razorpay’s Privacy Notice. Edit
              Preferences.
            </p>
          </div> */}

          <div className="w-full md:w-2/3 bg-white rounded-2xl relative">
            <h2 className="text-xl font-semibold py-6 m-0 text-center">
              Payment Method
            </h2>

            <div className="flex border-t border-gray-300">
              <div className="w-1/2 bg-[#FFE5EB] p-5 rounded-xl">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: "UPI", offer: "3 Offers" },
                    { title: "Cards", offer: "1.5% Saving" },
                    { title: "EMI", offer: "2.5% Cashback" },
                    { title: "Netbanking", offer: null },
                    { title: "Wallet", offer: "2.5% Cashback" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-lg">{item.title}</p>

                        {item.offer && (
                          <span className="text-green-600 text-sm bg-[#ECFFE5] px-[11px] py-1 rounded-[15px] block mt-1">
                            {item.offer}
                          </span>
                        )}
                      </div>

                      <div>
                        <Image
                          src="/assets/home/g-pay.svg"
                          alt={`${item.title} Icon`}
                          width={1000}
                          height={1000}
                          className="rounded-lg w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/2 bg-gray-50 rounded-xl p-6">
                <div>
                  <h3 className="text-base font-medium">Available Offers</h3>
                </div>

                <div className="flex bg-[#FFCCD7] p-3 rounded-full">
                  <div>
                    <Image
                      src="/assets/home/win-up.svg"
                      alt="Introduction"
                      width={1000}
                      height={1000}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                  <div>
                    <p>Win up to Rs200 cashback view...</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold">UPI QR</h3>
                <div className="mt-3 flex gap-3">
                  {/* QR Code */}
                  <div>
                    <Image
                      src="/assets/home/qrcode.svg"
                      alt="QR Code"
                      width={1000}
                      height={1000}
                      className="rounded-lg w-full h-full"
                    />
                  </div>

                  {/* Right Side Content */}
                  <div className="flex flex-col">
                    {/* Scan Instruction */}
                    <p className="text-sm">Scan the QR using any UPI App</p>

                    {/* UPI App Icons */}
                    <div className="flex items-center gap-2 mt-2">
                      {Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <Image
                            key={index}
                            src="/assets/home/phone-pay.svg"
                            alt="UPI Icon"
                            width={1000}
                            height={1000}
                            className="rounded-lg w-full h-full"
                          />
                        ))}
                    </div>

                    {/* Offers */}
                    <p className="bg-[#ECFFE5] w-fit text-sm text-green-600 mt-2">
                      4 Offers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFEBEE] rounded-b-2xl mt-6">
              <p className="text-center py-4 font-medium text-base">
                By proceeding, I agree to Razorpay’s Privacy Notice. Edit
                Preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-white">
        {/* Modal Box */}
        <div className="w-[350px] bg-linear-to-b from-[#E6FFE6] to-[#F4FFF4] shadow-lg rounded-xl p-6 relative">
          {/* Close Icon */}
          <button className="absolute right-4 top-4 text-gray-600 hover:text-black">
            <X size={20} />
          </button>

          {/* Check Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 shadow-lg">
              <span className="text-white text-3xl">✔</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-semibold mt-4">
            Payment Successful
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-sm mt-2">
            Your payment has been successfully processed. Now you can go to the
            homepage & discover new products.
          </p>

          {/* Button */}
          <div className="flex justify-center mt-5">
            <button className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
