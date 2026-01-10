import React from 'react'

export default function Book_Decors() {
    return (
        <div>
            <div className="relative bg-[#380119] bg-[url('/assets/sectionimages/bg.svg')] bg-cover bg-center bg-no-repeat text-white p-6 sm:p-8 min-h-[280px] sm:min-h-[327px] flex items-center justify-center mt-5 sm:mt-20">
                <div className="flex flex-col items-center text-center relative z-10">
                    <h5 className="text-2xl sm:text-4xl md:text-5xl mb-4">
                        Are You Ready to Enhance your Decor in Happy Moments?
                    </h5>

                    <p className="text-sm sm:text-base max-w-[600px] mb-6 px-2">
                        We help your decorations reach its growth. Book a call for 100%
                        no-obligation and free suggestions to learn more about how we can
                        assist you.
                    </p>

                    <button className="bg-(--pinkd) text-white px-5 py-2 sm:px-6 sm:py-3 rounded text-sm sm:text-base">
                        Book Your Decors
                    </button>
                </div>
            </div>
        </div>
    )
}
