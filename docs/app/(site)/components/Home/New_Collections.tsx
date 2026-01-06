import React from 'react'

export default function New_Collections() {
  return (
    <div>
      <div className="container mx-auto grid grid-cols-12 gap-4 p-4 sm:mt-10 mt-5">
        {/* LEFT BIG IMAGE */}
        <div className=" hidden md:block col-span-12 md:col-span-6 relative h-[420px] md:h-[520px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl overflow-hidden">
          <span className="absolute top-3 text-4xl font-bold text-black z-10">
            The New Collections
          </span>
          <span className="absolute top-[45px] left-2 text-black z-10">
            From Haldi to Honeymoon!
          </span>

          <img
            src="/assets/sectionimages/bigimages.svg"
            className="w-full h-full object-cover"
          />

          <span className="absolute bottom-3 left-3 bg-[#B56BA6] text-white text-xs px-3 py-1 rounded-full">
            Pastel Unicorn Theme
          </span>
        </div>

        {/* RIGHT SCROLLER / GRID */}
        <div className="
          col-span-12 md:col-span-6
          flex md:grid
          md:grid-cols-12
          gap-3
          overflow-x-auto md:overflow-visible
          h-auto md:h-[520px]
          snap-x snap-mandatory
          scroll-smooth">
          {/* CARD 1 */}
          <div className="min-w-[220px] md:min-w-0 h-[220px] md:h-[200px] md:col-span-4 relative rounded-xl overflow-hidden snap-start">
            <img
              src="/assets/sectionimages/thirdimg.png"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-[#B56BA6] text-white text-xs px-3 py-1 rounded-full">
              Kids Spider Theme
            </span>
          </div>

          {/* CARD 2 */}
          <div className="min-w-[220px] md:min-w-0 h-[220px] md:h-[200px] md:col-span-4 relative rounded-xl overflow-hidden snap-start">
            <img
              src="/assets/sectionimages/secondimg.svg"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-[#B56BA6] text-white text-xs px-3 py-1 rounded-full">
              Baby Shark Theme
            </span>
          </div>

          {/* CARD 3 */}
          <div className="min-w-[220px] md:min-w-0 h-[220px] md:h-[200px] md:col-span-4 relative rounded-xl overflow-hidden snap-start">
            <img
              src="/assets/sectionimages/fourthimg.svg"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-[#B56BA6] text-white text-xs px-3 py-1 rounded-full">
              Unicorn Theme Kids Birthday
            </span>
          </div>

          {/* CARD 4 */}
          <div className="min-w-[280px] md:min-w-0 h-[220px] md:h-[300px] md:col-span-6 relative rounded-xl overflow-hidden snap-start">
            <img
              src="/assets/sectionimages/wide1.svg"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-[#B56BA6] text-white text-xs px-3 py-1 rounded-full">
              Royal Prince Theme
            </span>
          </div>

          {/* CARD 5 */}
          <div className="min-w-[280px] md:min-w-0 h-[220px] md:h-[300px] md:col-span-6 relative rounded-xl overflow-hidden snap-start">
            <img
              src="/assets/sectionimages/wide2.svg"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-[#B56BA6] text-white text-xs px-3 py-1 rounded-full">
              Pastel Unicorn Theme
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
