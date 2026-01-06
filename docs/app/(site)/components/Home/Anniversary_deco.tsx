// import Link from 'next/link'

// export default function Anniversary_deco() {
//   return (
//     <div>
//       <div className="mt-10 container mx-auto p-4">
//         <div
//           id="Anniversary"
//           className="flex justify-between items-center mb-5 scroll-mt-24"
//         >
//           <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
//             Anniversary Decoration
//           </h3>
//           <Link
//             href="/view-all"
//             className="text-(--pinkd) underline text-[12px] sm:text-sm"
//           >
//             View All
//           </Link>
//         </div>
//         <div className="overflow-x-scroll md:overflow-hidden">
//           <div className="min-w-[700px] flex w-full gap-4 *:w-[25%] [&_p]:text-center [&_p]:text-black [&_p]:lg:text-lg [&_p]:text-md [&_p]:my-4 [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg">
//             <div>
//               <img src="/images/anniversardecor1.svg" alt="aniversary_deco" />
//               <div className="px-2 py-4">
//                 <div className="flex flex-col leading-none">
//                   <span className="text-yellow-400">★★★★★</span>
//                   <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                     Anniversary Home Decoration
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-[22px]">₹2999</span>
//                   <span className="text-gray-400 line-through text-sm">
//                     ₹3699
//                   </span>
//                   <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                     17% OFF
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <img src="/images/anniversardecor2.svg" alt="birthday_deco" />
//               <div className="px-2 py-4">
//                 <div className="flex flex-col leading-none">
//                   <span className="text-yellow-400">★★★★★</span>
//                   <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                     Romantic Anniversary Room
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-[22px]">₹2199</span>
//                   <span className="text-gray-400 line-through text-sm">
//                     ₹3699
//                   </span>
//                   <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                     17% OFF
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <img src="/images/anniversardecor3.svg" alt="kids_deco" />
//               <div className="px-2 py-4">
//                 <div className="flex flex-col leading-none">
//                   <span className="text-yellow-400">★★★★★</span>
//                   <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                     Shinny Anniversary Decors
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-[22px]">₹1999</span>
//                   <span className="text-gray-400 line-through text-sm">
//                     ₹2999
//                   </span>
//                   <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                     17% OFF
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <img src="/images/anniversardecor4.svg" alt="shower_deco" />
//               <div className="px-2 py-4">
//                 <div className="flex flex-col leading-none">
//                   <span className="text-yellow-400">★★★★★</span>
//                   <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                     Red Anniversary room Decors
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-[22px]">₹4399</span>
//                   <span className="text-gray-400 line-through text-sm">
//                     ₹8499
//                   </span>
//                   <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                     17% OFF
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// /* =======================
//    Types
// ======================= */

// interface Product {
//   id: number;
//   productName: string;
//   productImage: string | null;
//   price: number;
//   sellingPrice: number;
//   slug: string; // ✅ ADD THIS
// }

// /* =======================
//    Component
// ======================= */

// export default function Anniversary_deco() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   const CATEGORY_NAME = "Anniversary Decoration";

//   /* =======================
//      Fetch Products (NO CHANGE)
//   ======================= */

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `/api/products?category=${encodeURIComponent(CATEGORY_NAME)}&limit=4`
//       );

//       if (!res.ok) {
//         console.error("Failed to fetch anniversary products");
//         return;
//       }

//       const data = await res.json();
//       setProducts(data?.products || []);
//     } catch (error) {
//       console.error("Error fetching anniversary products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================
//      Helpers (NO CHANGE)
//   ======================= */

//   const calculateDiscount = (price: number, sellingPrice: number) => {
//     if (price > sellingPrice) {
//       return Math.round(((price - sellingPrice) / price) * 100);
//     }
//     return 0;
//   };

//   /* =======================
//      UI
//   ======================= */

//   if (loading || products.length === 0) {
//     return null;
//   }

//   return (
//     <div className="mt-10 container mx-auto p-4">
//       {/* Header */}
//       <div
//         id="Anniversary"
//         className="flex justify-between items-center mb-5 scroll-mt-24"
//       >
//         <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
//           Anniversary Decoration
//         </h3>

//         <Link
//           href={`/view-all?category=${encodeURIComponent(CATEGORY_NAME)}`}
//           className="text-(--pinkd) underline text-[12px] sm:text-sm"
//         >
//           View All
//         </Link>
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 cursor-pointer">
//         {products.map((product) => {
//           const discount = calculateDiscount(
//             product.price,
//             product.sellingPrice
//           );

//           // const imageUrl =
//           //   product.productImage?.startsWith("/api/uploads/")
//           //     ? product.productImage
//           //     : "/assets/home/birthday_deco/1.jpg";

//           const imageUrl =
//             product.productImage &&
//               product.productImage.startsWith("/uploads/")
//               ? product.productImage
//               : "/assets/home/explore/aniversary_deco.jpg";

//           return (
//             // <Link key={product.id} href={`/products/${product.id}`}>
//             <Link href={`/product-details/${product.id}`}>
//               <img
//                 src={imageUrl}
//                 alt={product.productName}
//                 className="w-full object-cover rounded-lg"
//               />

//               <div className="px-2 py-4">
//                 <div className="flex flex-col leading-none">
//                   <span className="text-yellow-400">★★★★★</span>

//                   <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3 line-clamp-2">
//                     {product.productName}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <span className="font-[22px]">
//                     ₹{product.sellingPrice}
//                   </span>

//                   {product.price > product.sellingPrice && (
//                     <>
//                       <span className="text-gray-400 line-through text-sm">
//                         ₹{product.price}
//                       </span>

//                       {discount > 0 && (
//                         <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                           {discount}% OFF
//                         </span>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* =======================
   Types
======================= */
interface Product {
  id: number;
  productName: string;
  slug: string;
  productImage: string | null;
  price: number;
  sellingPrice: number;
}

/* =======================
   Component
======================= */
export default function AnniversaryDecoration() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORY_NAME = "Anniversary Decoration";

  /* =======================
     Fetch Products (NO CHANGE)
  ======================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/products?category=${encodeURIComponent(CATEGORY_NAME)}&limit=4`
      );

      if (!res.ok) {
        setProducts([]);
        return;
      }

      const data = await res.json();
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error fetching anniversary products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Helpers (NO CHANGE)
  ======================= */
  const calculateDiscount = (price: number, sellingPrice: number) => {
    if (price > sellingPrice) {
      return Math.round(((price - sellingPrice) / price) * 100);
    }
    return 0;
  };

  /* =======================
     Product Card (UI ONLY)
  ======================= */
  const renderProductCard = (product: Product) => {
    const discount = calculateDiscount(
      product.price,
      product.sellingPrice
    );

    const imageUrl =
      product.productImage &&
      product.productImage.startsWith("/uploads/")
        ? product.productImage
        : "/assets/home/explore/aniversary_deco.jpg";

    return (
      <Link
        key={product.id}
        href={`/product-details/${product.id}`}
        className="cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={product.productName}
          className="w-full aspect-square object-cover rounded-lg mb-4"
        />

        <div className="px-2">
          <span className="text-yellow-400 block">★★★★★</span>

          <p className="text-sm md:text-base lg:text-lg font-medium mb-2 line-clamp-2">
            {product.productName}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg">
              ₹{product.sellingPrice}
            </span>

            {product.price > product.sellingPrice && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.price}
                </span>

                {discount > 0 && (
                  <span className="border border-[#93F8C5] rounded-xl px-2 py-0.5 text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white">
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="container mx-auto p-4 sm:mt-10 mt-5">
      {/* Header */}
      <div
        id="Anniversary"
        className="flex justify-between items-center mb-5 scroll-mt-24"
      >
        <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
          {CATEGORY_NAME}
        </h3>

        <Link
          href={`/view-all?category=${encodeURIComponent(CATEGORY_NAME)}`}
          className="text-(--pinkd) underline text-[12px] sm:text-sm"
        >
          View All
        </Link>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map(renderProductCard)}
        </div>
      ) : null}
    </div>
  );
}

