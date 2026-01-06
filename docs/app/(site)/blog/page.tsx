// app/page.tsx (or blog/page.tsx if inside a folder)
"use client";
import Image from "next/image";
import CategoriesList from "../components/CategoriesList";
import SocialIcons from "../components/SocialIcons";

export default function NewsletterSection() {
  return (
    <div>
      <div className="container mx-auto bg-[#E6E6E6] md:bg-transparent px-4 py-12">
        <div>
          <h2>Home Blog</h2>
        </div>

        <div className="relative px-6 py-10 md:px-8 md:py-16 bg-[#3F102E] flex flex-col md:flex-row gap-10 md:gap-5">
          {/* LEFT TEXT SECTION */}
          <div
            className="text-white w-full md:w-[60%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight md:leading-[75px]
          "
          >
            Balloons do more than decorate — they create emotion, excitement,
            and togetherness.
          </div>

          {/* RIGHT NEWSLETTER BOX */}
          <div
            className="
      bg-[#FEDAEB] rounded-3xl p-6 sm:p-8 
      w-full md:w-[40%]
      mb-0 md:-mb-[120px]
      shadow-lg
    "
          >
            <h2 className="font-semibold text-xl sm:text-2xl mb-2">
              Stay Updated With Our Newsletter
            </h2>

            <p className="text-sm font-normal mb-4">
              Get monthly updates on productivity hacks, time management tips,
              new features, and industry insights
            </p>

            <form className="flex flex-col gap-2 mt-6">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                className="bg-white border border-black p-2 rounded"
              />

              <label className="text-sm font-medium mt-2">Email ID*</label>
              <input
                type="email"
                required
                className="bg-white border border-black p-2 rounded"
              />

              <button
                type="submit"
                className="bg-[#FC6E88] text-white mx-auto mt-4 py-2 px-6 rounded hover:bg-pink-500 transition"
              >
                Submit
              </button>

              <p className="mx-auto text-sm font-semibold mt-4 text-gray-700 text-center">
                We promise, we don’t spam.{" "}
                <span className="text-pink-500 underline">Privacy Policy</span>
              </p>
            </form>
          </div>
        </div>

        <div className="mt-5 lg:mt-[140px] grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10">
          {/* LEFT - 8 columns */}
          <div className="order-2 lg:order-1 lg:col-span-8">
            <h2
              className="mb-2 md:mb-4 
           mt-4 md:mt-6 
           text-3xl sm:text-4xl md:text-5xl 
           font-bold"
            >
              Recent Posts
            </h2>

            <div className="border my-4 md:my-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent ml-0 md:ml-5">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent ml-0 md:ml-5">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent ml-0 md:ml-5">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent ml-0 md:ml-5">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
              <div className="px-5 py-8 border-2 md:border border-[#CBCBCB] bg-white md:bg-transparent">
                <Image
                  src="/assets/home/card-img.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
                <div className="text-xs font-medium bg-[#C8E1FF] w-fit px-3 rounded my-2">
                  Birth Decoration
                </div>
                <p className="text-lg font-medium">
                  Why Balloon Decoration Is The Heart of Every Celebrations
                </p>
                <p className="text-sm font-normal">
                  Balloon decoration brings instant joy, color, and life to any
                  event. Whether it’s a birthday...
                </p>
                <div className="mt-2">
                  <Image
                    src="/assets/home/card-girl.svg"
                    alt="card-img"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-bold">Ruhi Sinha</p>
                  <p className="text-sm font-normal">
                    Senior Mentor | Decorations Specialist
                  </p>
                </div>
              </div>
            </div>

            <div className="block lg:hidden">
              <div>
                <div className="border border-black "></div>
                <SocialIcons />
                <div className="relative mt-8 max-w-[500px] mx-auto">
                  <Image
                    src="/assets/home/birthday.svg"
                    alt="card-img"
                    width={1000}
                    height={1000}
                    className="w-full h-auto"
                  />
                  <div className="absolute top-0 w-full h-full rounded-3xl bg-[#0000009E] flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white">
                      Master Time, Boost Decoration, Achieve More
                    </h2>

                    <button className="mt-6 sm:mt-8 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium text-white bg-[linear-gradient(90deg,rgba(252,110,136,1)_53%,rgba(255,6,6,1)_87%)]">
                      Try Funtook Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - 4 columns */}
          <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col justify-between">
            <div>
              <CategoriesList />
            </div>
            <div>
              <div className="border border-black hidden lg:block"></div>

              <div className="lg:block hidden mobilehidden">
                <SocialIcons />
              </div>

              <div className="relative mt-8 hidden lg:block">
                <Image
                  src="/assets/home/birthday.svg"
                  alt="card-img"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />

                {/* Overlay */}
                <div className="absolute top-0 w-full h-full rounded-3xl bg-[#0000009E] flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white">
                    Master Time, Boost Decoration, Achieve More
                  </h2>

                  <button className="mt-6 sm:mt-8 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium text-white bg-[linear-gradient(90deg,rgba(252,110,136,1)_53%,rgba(255,6,6,1)_87%)]">
                    Try Funtook Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <section>
        <div className="bg-[#B189A3] text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-10  ">
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
    </div>
  );
}
