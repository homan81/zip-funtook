export default function Customers() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-[#000000] text-center">
          What Our Customers Say
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="relative bg-white border border-pink-200 rounded-2xl p-8 pt-14 shadow-md">
            {/* Profile Image */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-r from-pink-400 to-purple-400">
                <img
                  src="/assets/about-imgs/Ellipse 9.svg"
                  alt="user"
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 text-center">
              <span className="inline-block bg-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-medium">
                Nupur Chauhan • Patna
              </span>

              <p className="mt-5 text-gray-700 leading-relaxed">
                We hired Funtooks for our wedding reception, and they exceeded expectations!
                The elegant balloon centerpieces and entrance decor added a magical touch to
                our special day.
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mt-5 text-lg">
                {Array(5).fill(0).map((_, i) => (
                  <img
                    key={i}
                    src="/assets/about-imgs/icons/star.svg"
                    alt="Star Icon"
                    className={`w-5 h-5 ${i === 2 ? 'w-6 h-6' : ''}`} // third star bigger
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="relative bg-white border border-pink-200 rounded-2xl p-8 pt-14">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-r from-pink-400 to-purple-400">
                <img
                  src="/assets/about-imgs/Ellipse 9.svg"
                  alt="user"
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="inline-block bg-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-medium">
                Riya Sharma • Delhi
              </span>

              <p className="mt-5 text-gray-700 leading-relaxed">
                Amazing decoration and professional team! Funtooks made our event beautiful
                and memorable with their elegant balloon theme work.
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mt-5 text-lg">
                {Array(5).fill(0).map((_, i) => (
                  <img
                    key={i}
                    src="/assets/about-imgs/icons/star.svg"
                    alt="Star Icon"
                    className={`w-5 h-5 ${i === 2 ? 'w-6 h-6' : ''}`} // third star bigger
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="relative bg-white border border-pink-200 rounded-2xl p-8 pt-14">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-r from-pink-400 to-purple-400">
                <img
                  src="/assets/about-imgs/Ellipse 9.svg"
                  alt="user"
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="inline-block bg-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-medium">
                Karan Verma • Mumbai
              </span>

              <p className="mt-5 text-gray-700 leading-relaxed">
                They made our birthday celebration amazing! Great service, beautiful balloon
                designs, and very friendly staff. Highly recommended!
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mt-5 text-lg">
                {Array(5).fill(0).map((_, i) => (
                  <img
                    key={i}
                    src="/assets/about-imgs/icons/star.svg"
                    alt="Star Icon"
                    className={`w-5 h-5 ${i === 2 ? 'w-6 h-6' : ''}`} // third star bigger
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
