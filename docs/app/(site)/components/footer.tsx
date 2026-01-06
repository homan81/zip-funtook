"use client";
import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, ChevronDown } from "lucide-react";

export default function Footer() {
  const [open, setOpen] = useState({
    links: false,
    services: false,
  });

  return (
    <footer className="bg-[#1b0a0a] text-white">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Brand */}
        <div>
          <img src="/images/logowhite.svg" alt="logo" />
          <p className="text-sm text-gray-300 leading-relaxed hidden md:block ">
            Funtook, your one-step destination creating unstopable moments. At
            Funtook, we specialize in transforming your celebrations.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="m-0 md:ml-[100px]">
          <button
            onClick={() => setOpen((p) => ({ ...p, links: !p.links }))}
            className="w-full flex justify-between items-center underline md:pointer-events-none"
          >
            QUICK LINKS
            <ChevronDown
              className={`w-4 h-4 md:hidden transition ${open.links ? "rotate-180" : ""
                }`}
            />
          </button>

          <ul
            className={`
              mt-3 space-y-2 text-sm text-gray-300
              ${open.links ? "block" : "hidden"}
              md:block
            `}
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/blog2">Shop</Link>
            </li>
            <li>
              <Link href="/blog">Blogs</Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link href="/recent-work">Recent Work</Link>
            </li>
          </ul>
        </div>

        {/* OUR SERVICES */}
        <div>
          <button
            onClick={() => setOpen((p) => ({ ...p, services: !p.services }))}
            className="w-full flex justify-between items-center underline md:pointer-events-none"
          >
            OUR SERVICES
            <ChevronDown
              className={`w-4 h-4 md:hidden transition ${open.services ? "rotate-180" : ""
                }`}
            />
          </button>

          <ul
            className={`
              mt-3 space-y-2 text-sm text-gray-300
              ${open.services ? "block" : "hidden"}
              md:block
            `}
          >
            <li>
              <Link href="/#Baby-Welcome">Baby Welcome</Link>
            </li>
            <li>
              <Link href="/#Anniversary">Anniversary Decoration</Link>
            </li>
            <li>
              <Link href="/#Baby-shower">Baby Shower</Link>
            </li>
            <li>
              <Link href="/#Birthday">Birthday Decoration</Link>
            </li>
            <li>
              <Link href="/#Kids-birthday">Kids Theme Party</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-sm text-gray-300">info@funtook.in</p>
          <p className="text-sm text-gray-300">+91 9508638307</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="container mx-auto border-t border-gray-700">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-start justify-between gap-4 text-sm text-white">
          <div className="flex gap-4">
            <Instagram className="w-5 h-5" />
            <Facebook className="w-5 h-5" />
            <Youtube className="w-5 h-5" />
          </div>
          <p>© Copyright 2024. Designed by funtook. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

