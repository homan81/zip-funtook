export default function OurStory() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4">

        {/* Wrapper Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch bg-[#FCF0F2]">

          {/* LEFT IMAGE (Full on Mobile) */}
            <div className="w-full flex items-center justify-center">
              <img
                src="/assets/about-imgs/recright.svg"
                alt="Purple balloons decoration"
                className="w-full h-auto md:w-[260px] rounded-none object-cover"
              />
            </div>

          {/* CENTER TEXT */}
          <div className="px-6 py-6 md:py-12 flex flex-col justify-center text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
              Our Decoration Journey
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              At <span className="font-semibold text-gray-900">Funtook Decorations</span>, 
              we believe every space deserves a story — one told through 
              color, texture, and creativity. What started as a small passion 
              for design and event styling has grown into a full-service 
              decoration brand known for transforming ordinary venues into 
              extraordinary experiences.
            </p>
          </div>

          {/* RIGHT IMAGE (HIDDEN ON MOBILE) */}
          <div className="h-full hidden md:block">
            <img
              src="/assets/about-imgs/recleft.svg"
              alt="Colorful balloon arch decoration"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
