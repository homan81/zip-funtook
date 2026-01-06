"use client";

export default function Explore() {
  return (
    <div className="container mx-auto pb-15 px-5">
      <div className="text-center mb-15 headings_border">
        <h2 className="font-bold text-[34px]">Explore</h2>
        <p className="text-[18px] text-(--subhead)">Wide Range Of Options</p>
      </div>
 
      {/* Grid container */}
      <div className="grid grid-cols-3 gap-6 md:flex md:gap-6 md:justify-center mb-10">
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/kids1.svg"
            className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
          />
          <span className="text-xs md:text-sm mt-2">Pastel Unicorn Theme</span>
        </div>
 
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/kids2.svg"
            className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
          />
          <span className="text-xs md:text-sm mt-2">Baby Shark Theme</span>
        </div>
 
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/kids3.svg"
            className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
          />
          <span className="text-xs md:text-sm mt-2">Kids Spider Theme</span>
        </div>
 
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/kids4.svg"
            className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
          />
          <span className="text-xs md:text-sm mt-2">Royal Prince Theme</span>
        </div>
 
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/kids5.svg"
            className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
          />
          <span className="text-xs md:text-sm mt-2">
            Ring Theme Kids Birth..
          </span>
        </div>
 
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/kids6.svg"
            className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
          />
          <span className="text-xs md:text-sm mt-2">
            Home Birthday Arrang..
          </span>
        </div>
      </div>
    </div>
  );
}
