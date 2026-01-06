"use client";

import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function SocialIcons() {

    return (

        <div className="flex flex-col items-center px-4">
            <h2 className="text-3xl sm:text-4xl my-6 text-center">STAY IN TOUCH</h2>

            <div className="w-full max-w-[500px]">
                {/* Row 1 */}
                <div className="grid grid-cols-2 items-center justify-center gap-x-15 gap-y-5">
                    <div className="flex items-center gap-2.5">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl sm:text-3xl text-white bg-[#1877F2] hover:bg-pink-500 transition-colors rounded-full flex justify-center items-center p-2.5"
                        >
                            <FaFacebookF />
                        </a>
                        <h2 className="text-sm sm:text-base font-medium">FACEBOOK</h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl sm:text-3xl text-white bg-[#EC7494] hover:bg-pink-500 transition-colors rounded-full flex justify-center items-center p-2.5"
                        >
                            <FaInstagram />
                        </a>
                        <h2 className="text-sm sm:text-base font-medium">INSTAGRAM</h2>
                    </div>
                    {/* </div>

                    <div className="flex flex-row items-center justify-center gap-8 sm:gap-20"> */}
                    <div className="flex items-center gap-2.5">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl sm:text-3xl text-white bg-[#1E1E1E] hover:bg-pink-500 transition-colors rounded-full flex justify-center items-center p-2.5"
                        >
                            <FaTwitter />
                        </a>
                        <h2 className="text-sm sm:text-base font-medium">TWITTER</h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl sm:text-3xl text-white bg-[#709DFF] hover:bg-pink-500 transition-colors rounded-full flex justify-center items-center p-2.5"
                        >
                            <FaLinkedinIn />
                        </a>
                        <h2 className="text-sm sm:text-base font-medium">LINKEDIN</h2>
                    </div>
                </div>
            </div>
        </div>


    );
}
