"use client";
import Image from "next/image";
import { X } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Modal Box */}
      <div className="w-[350px] bg-gradient-to-b from-[#E6FFE6] to-[#F4FFF4] shadow-lg rounded-xl p-6 relative">

        {/* Close Icon */}
        <button className="absolute right-4 top-4 text-gray-600 hover:text-black">
          <X size={20} />
        </button>

        {/* Check Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 shadow-lg">
            <span className="text-white text-3xl">✔</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold mt-4">
          Payment Successful
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-sm mt-2">
          Your payment has been successfully processed. Now you can go to the homepage & discover new products.
        </p>

        {/* Button */}
        <div className="flex justify-center mt-5">
          <button className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
