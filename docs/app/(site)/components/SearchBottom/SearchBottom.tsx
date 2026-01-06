"use client";
import { X, Search, TrendingUp, ArrowLeft } from "lucide-react";

export default function SearchBottomSheet({
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
        <div className="flex items-center gap-3 p-4">
          <button onClick={onClose}>
            <ArrowLeft
              size={28} // adjust size
              strokeWidth={2} // thickness
              className="text-gray-600"
            />
          </button>

          <input
            type="text"
            placeholder="Search for decorations..."
            className="flex-1 px-3 py-2.5 rounded-base outline-none text-sm"
            autoFocus
          />

          <Search size={20} className="text-gray-500" />
        </div>

        {/* Popular Searches */}
        <div className="p-4">
          <h3 className="font-semibold mb-3">Popular Searches</h3>

          <ul className="space-y-4 text-sm">
            {[
              "Balloon decorations",
              "Welcome Decoration",
              "Decoration for Kids",
              "Baby Shower Decor",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-700">
                <TrendingUp size={16} className="text-(--pinkd)" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
