// "use client";

// export default function Explore() {
//   return (
//     <div className="container mx-auto p-5 sm:pb-15 px-4">
//       <div className="text-center mb-8 sm:mb-15 headings_border">
//         <h2 className="font-bold text-[34px]">Explore</h2>
//         <p className="text-[18px] text-(--subhead)">Wide Range Of Options</p>
//       </div>
//       <div className="w-full">
//         <div
//           className="
//             grid grid-cols-3 lg:grid-cols-6 gap-4
//             [&_p]:text-center
//             [&_p]:text-black
//             [&_p]:text-xs
//             sm:[&_p]:text-sm
//             lg:[&_p]:text-lg
//             [&_p]:mt-2
//           "
//         >
//           <div>
//             <div
//               className="
//                 mx-auto overflow-hidden rounded-xl
//                 w-full max-w-[120px]
//                 sm:max-w-[160px]
//                 lg:max-w-[230px]
//                 aspect-square
//               "
//             >
//               <img
//                 src="/assets/home/explore/pic1.png"
//                 alt="Anniversary Decoration"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p>Birthday Decorations</p>
//           </div>
//           <div>
//             <div
//               className="
//                 mx-auto overflow-hidden rounded-xl
//                 w-full max-w-[120px]
//                 sm:max-w-[160px]
//                 lg:max-w-[230px]
//                 aspect-square
//               "
//             >
//               <img
//                 src="/assets/home/explore/pic2.png"
//                 alt="Anniversary Decoration"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p>Anniversary Decoration</p>
//           </div>
//           <div>
//             <div
//               className="
//                 mx-auto overflow-hidden rounded-xl
//                 w-full max-w-[120px]
//                 sm:max-w-[160px]
//                 lg:max-w-[230px]
//                 aspect-square
//               "
//             >
//               <img
//                 src="/assets/home/explore/pic3.png"
//                 alt="Anniversary Decoration"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p>Welcome Baby Decoration</p>
//           </div>
//           <div>
//             <div
//               className="
//                 mx-auto overflow-hidden rounded-xl
//                 w-full max-w-[120px]
//                 sm:max-w-[160px]
//                 lg:max-w-[230px]
//                 aspect-square
//               "
//             >
//               <img
//                 src="/assets/home/explore/pic4.png"
//                 alt="Anniversary Decoration"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p>Baby Shower Decoration</p>
//           </div>
//           <div>
//             <div
//               className="
//                 mx-auto overflow-hidden rounded-xl
//                 w-full max-w-[120px]
//                 sm:max-w-[160px]
//                 lg:max-w-[230px]
//                 aspect-square
//               "
//             >
//               <img
//                 src="/assets/home/explore/pic5.png"
//                 alt="Anniversary Decoration"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p>Balloon Hampers</p>
//           </div>
//           <div>
//             <div
//               className="
//               mx-auto overflow-hidden rounded-xl
//               w-full max-w-[120px]
//               sm:max-w-[160px]
//               lg:max-w-[230px]
//               aspect-square
//             "
//             >
//               <img
//                 src="/assets/home/explore/pic6.png"
//                 alt="Anniversary Decoration"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p>Surprising Loved Decoration</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  image: string;
}

export default function Explore() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories"); // Fetching from your categories table
        const data = await res.json();
        // Taking the first 6 categories as per your UI design
        setCategories(data.categories?.slice(0, 6) || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    // Navigates to view-all with both ID and Name for the filter we built
    router.push(`/view-all?category_id=${category.id}&category=${encodeURIComponent(category.name)}`);
  };

  if (loading) return <div className="text-center py-10">Loading Categories...</div>;

  return (
    <div className="container mx-auto p-5 sm:pb-15 px-4">
      <div className="text-center mb-8 sm:mb-15 headings_border">
        <h2 className="font-bold text-[34px]">Explore</h2>
        <p className="text-[18px] text-(--subhead)">Wide Range Of Options</p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="cursor-pointer group"
              onClick={() => handleCategoryClick(cat)}
            >
              <div
                className="
                  mx-auto overflow-hidden rounded-xl
                  w-full max-w-[120px]
                  sm:max-w-[160px]
                  lg:max-w-[230px]
                  aspect-square
                  transition-transform duration-300 group-hover:scale-105
                "
              >
                <img
                  // Using the image path from your SQL table screenshot
                  src={cat.image || "/assets/home/explore/pic1.png"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-black text-xs sm:text-sm lg:text-lg mt-2 font-medium">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}