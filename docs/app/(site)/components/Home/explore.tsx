"use client";

export default function Explore() {
  return (
    <div className="container mx-auto p-5 sm:pb-15 px-5">
      <div className="text-center mb-8 sm:mb-15 headings_border">
        <h2 className="font-bold text-[34px]">Explore</h2>
        <p className="text-[18px] text-(--subhead)">Wide Range Of Options</p>
      </div>
      <div className="w-full">
        <div
          className="
      grid grid-cols-3 lg:grid-cols-6 gap-4
      [&_p]:text-center
      [&_p]:text-black
      [&_p]:text-xs
      sm:[&_p]:text-sm
      lg:[&_p]:text-lg
      [&_p]:mt-2
    "
        >
          <div>
            <div
              className="
                mx-auto overflow-hidden rounded-xl
                w-full max-w-[120px]
                sm:max-w-[160px]
                lg:max-w-[230px]
                aspect-square
              "
            >
              <img
                src="/assets/home/explore/pic1.png"
                alt="Anniversary Decoration"
                className="w-full h-full object-cover"
              />
            </div>
            <p>Anniversary Decoration</p>
          </div>
          <div>
            <div
              className="
                mx-auto overflow-hidden rounded-xl
                w-full max-w-[120px]
                sm:max-w-[160px]
                lg:max-w-[230px]
                aspect-square
              "
            >
              <img
                src="/assets/home/explore/pic2.png"
                alt="Anniversary Decoration"
                className="w-full h-full object-cover"
              />
            </div>
            <p>Anniversary Decoration</p>
          </div>
          <div>
            <div
              className="
                mx-auto overflow-hidden rounded-xl
                w-full max-w-[120px]
                sm:max-w-[160px]
                lg:max-w-[230px]
                aspect-square
              "
            >
              <img
                src="/assets/home/explore/pic3.png"
                alt="Anniversary Decoration"
                className="w-full h-full object-cover"
              />
            </div>
            <p>Anniversary Decoration</p>
          </div>
          <div>
            <div
              className="
                mx-auto overflow-hidden rounded-xl
                w-full max-w-[120px]
                sm:max-w-[160px]
                lg:max-w-[230px]
                aspect-square
              "
            >
              <img
                src="/assets/home/explore/pic4.png"
                alt="Anniversary Decoration"
                className="w-full h-full object-cover"
              />
            </div>
            <p>Anniversary Decoration</p>
          </div>
          <div>
            <div
              className="
                mx-auto overflow-hidden rounded-xl
                w-full max-w-[120px]
                sm:max-w-[160px]
                lg:max-w-[230px]
                aspect-square
              "
            >
              <img
                src="/assets/home/explore/pic5.png"
                alt="Anniversary Decoration"
                className="w-full h-full object-cover"
              />
            </div>
            <p>Anniversary Decoration</p>
          </div>
          <div>
            <div
              className="
              mx-auto overflow-hidden rounded-xl
              w-full max-w-[120px]
              sm:max-w-[160px]
              lg:max-w-[230px]
              aspect-square
            "
            >
              <img
                src="/assets/home/explore/pic6.png"
                alt="Anniversary Decoration"
                className="w-full h-full object-cover"
              />
            </div>
            <p>Anniversary Decoration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
