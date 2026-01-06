import Image from "next/image";

export default function Commitment() {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-0 items-center">

        {/* LEFT IMAGES */}
        <div className="relative w-full flex md:justify-start">
          
          {/* FIRST IMAGE */}
          <div className="w-[75%] md:w-[65%] rounded-2xl overflow-hidden pt-5">
            <Image
              src="/assets/about-imgs/child1.svg"
              alt="Decor Image 1"
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* SECOND IMAGE */}
          <div className="
            absolute 
            top-[120px] left-1/2 -translate-x-1/2 
            md:top-[162px] md:left-[185px] ml-[60px] md:translate-x-0
            w-[65%] md:w-[50%] 
            rounded-2xl overflow-hidden shadow-xl
          ">
            <Image
              src="/assets/about-imgs/child2.svg"
              alt="Decor Image 2"
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-5 mt-28 pt-2 md:mt-0">
          <h2 className="text-3xl font-bold text-[#000000]">
            Our Commitment <br /> To Decoration Culture
          </h2>

          <p className="text-gray-600 leading-relaxed">
            At Funtook, we celebrate the art of decoration as more than just visual beauty — 
            it’s a reflection of culture, emotion, and connection.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Our commitment is to preserve the essence of cultural expression while giving it 
            a modern, innovative touch for every event.
          </p>

          <p className="text-gray-600 leading-relaxed">
            We take pride in working with local artisans, sustainable materials, and design 
            techniques that honor heritage while embracing the new.
          </p>
        </div>

      </div>
    </section>
  );
}
