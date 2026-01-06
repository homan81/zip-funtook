"use client";

import { X, Phone, Mail, MapPin } from "lucide-react";

export default function ContactBottomSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 w-full h-full bg-white z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 text-center">
          <h3 className="text-3xl font-semibold">Contact Us</h3>
          <p className="text-sm text-gray-500 mt-1">
            For assistance, please contact us using any of the methods below.
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 space-y-4">
          {/* address*/}
          <div className="flex items-center gap-4 bg-pink-50 rounded-xl p-4">
            <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg">
              <MapPin className="text-(--pinkd)" size={22} />
            </div>
            <div>
              <p className="font-bold text-sm">
                Address
              </p>
              <p className="text-sm text-gray-600">Kankarbagh, Near Pc Colony,Infront of First Cry ShopPatna,Bihar (800020) </p>
            </div>
          </div>

          {/* Call */}
          <div className="flex items-center gap-4 bg-pink-50 rounded-xl p-4">
            <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg">
              <Phone className="text-(--pinkd)" size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">
                Give us a call
              </p>
              <p className="text-sm text-gray-600">+91 9508638307</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 bg-pink-50 rounded-xl p-4">
            <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg">
              <Mail className="text-(--pinkd)" size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">E-Mail us at</p>
              <p className="text-sm text-gray-600">
                info@funtook.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
