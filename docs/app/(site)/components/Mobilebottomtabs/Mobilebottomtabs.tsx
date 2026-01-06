"use client";
import { useState } from "react";
import { Home, Grid, Search, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBottom from "../SearchBottom/SearchBottom";
import ContactBottom from "../ContactBottom/ContactBottom";

export default function MobileBottomTabs() {
  const pathname = usePathname();
  const [openSearch, setOpenSearch] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  const activeClass = (path: string) =>
    pathname === path
      ? "text-(--pinkd) border-t-2 border-(--pinkd)"
      : "text-gray-600 border-t-2 border-transparent";

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-white z-50 flex justify-around py-2 md:hidden">
        <Link
          href="/"
          className={`flex flex-col items-center pt-2 ${activeClass("/")}`}
        >
          <Home size={22} />
          <p className="text-xs">Home</p>
        </Link>

        <Link
          href="/categories"
          className={`flex flex-col items-center pt-2 ${activeClass(
            "/categories"
          )}`}
        >
          <Grid size={22} />
          <p className="text-xs">Categories</p>
        </Link>

        {/* SEARCH → OPEN POPUP */}
        <button
          onClick={() => setOpenSearch(true)}
          className="flex flex-col items-center pt-2 text-gray-600"
        >
          <Search size={22} />
          <p className="text-xs">Search</p>
        </button>

        <button
          onClick={() => setOpenContact(true)}
          className="flex flex-col items-center pt-2 text-gray-600"
        >
          <Phone size={22} />
          <p className="text-xs">Contact</p>
        </button>
      </div>

      {/* Search Popup */}
      <SearchBottom isOpen={openSearch} onClose={() => setOpenSearch(false)} />
      <ContactBottom
        isOpen={openContact}
        onClose={() => setOpenContact(false)}
      />
    </>
  );
}
