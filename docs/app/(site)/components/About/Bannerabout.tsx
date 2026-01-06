export default function AboutBanner() {
  return (
    <section className="relative w-full h-[200px] md:h-[350px] lg:h-[420px]">
      {/* Background Image */}
      <img
        src="/assets/about-imgs/bgimg.svg"
        alt="About Us Banner"
        className="w-full h-full object-cover brightness-75"
      />

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-black drop-shadow-lg">
          ABOUT
        </h2>
        <h2 className="text-3xl md:text-5xl font-bold text-black drop-shadow-lg">
          US
        </h2>
      </div>
    </section>
  );
}
