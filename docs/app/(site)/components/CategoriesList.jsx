"use client";

import { useState } from "react";

const categoriesData = [
  {
    name: "Anniversary Decoration",
    sub: ["Flowers", "Balloons", "Lighting"],
  },
  {
    name: "Baby Shower",
    sub: ["Decor", "Games", "Cakes"],
  },
  {
    name: "Birthday Decoration",
    sub: ["Themes", "Balloons", "Party Favors"],
  },
  {
    name: "Baby Welcome",
    sub: ["Themes", "Balloons", "Party Favors"],
  },
  {
    name: "Blogs",
    sub: ["Themes", "Balloons", "Party Favors"],
  },
];

export default function CategoriesList() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCategory = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (



    <div className="">
      <div className="md:w-fit">
        <div className="flex border border-[#FC6E88]  overflow-hidden focus-within:ring-1 focus-within:ring-pink-500">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 w-fit max-w-md mx-auto pt-1 pb-1 pl-1.5 px-0 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#FC6E88] text-white px-4 py-1.5  hover:bg-pink-500 transition"
          >
            Search
          </button>
        </div>
      </div>
      <h2 className="text-4xl font-medium my-4">Categories</h2>
      <ul className="list-none p-0">
        {categoriesData.map((cat, index) => (
          <li key={index} className="mb-2">
            <div
              className="flex items-center cursor-pointer select-none relative pl-6 text-gray-800"
              onClick={() => toggleCategory(index)}
            >
              {cat.sub && (
                <span
                  className={`absolute left-0 transition-transform duration-200 ${activeIndex === index ? "rotate-90" : "rotate-0"
                    }`}
                >
                  ►
                </span>
              )}
              <span className="text-base font-medium">{cat.name}</span>
            </div>

            {cat.sub && activeIndex === index && (
              <ul className="list-none pl-8 mt-1 space-y-1">
                {cat.sub.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className="relative pl-4 text-gray-600 text-sm before:content-['•'] before:absolute before:left-0 before:text-gray-500"
                  >
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
