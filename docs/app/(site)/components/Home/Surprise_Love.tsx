// import Link from 'next/link'
// import React from 'react'

// export default function Surpise_Love() {
//   return (
//     <div>
//        <div className="mt-10 container mx-auto p-4">
//         <div
//           id="Anniversary"
//           className="flex justify-between items-center mb-5 scroll-mt-24"
//         >
//           <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
//             Surprising Loved Once Decoration
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
//               <img src="/images/surprise.svg" alt="aniversary_deco" />
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
//               <img src="/images/room decor.svg" alt="birthday_deco" />
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
//               <img src="/images/roomdecors.svg" alt="shower_deco" />
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
//               <img src="/images/21bday.svg" alt="kids_deco" />
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
// }

// /* =======================
//    Component
// ======================= */

// export default function Surprising_Loved_Once() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   const CATEGORY_NAME = "Surprising Loved Once Decoration";

//   /* =======================
//      Fetch Products
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
//         console.error("Failed to fetch Surprising Loved Once products");
//         return;
//       }

//       const data = await res.json();
//       setProducts(data?.products || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================
//      Helpers
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
//         id="SurprisingLovedOnce"
//         className="flex justify-between items-center mb-5 scroll-mt-24"
//       >
//         <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
//           Surprising Loved Once Decoration
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

//           const imageUrl =
//             product.productImage &&
//             product.productImage.startsWith("/uploads/")
//               ? product.productImage
//               : "/assets/home/explore/birthday_deco.jpg";

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
   TYPES (Updated to match your API)
======================= */
interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

interface Product {
  id: number;
  productName: string;
  productImage: string | null;
  price: string | number; // API returns string "3499.00"
  sellingPrice: string | number;
  stockQuantity: number;
  category: string;
  category_id: number;
}

interface CategoryWithProducts {
  category: Category;
  products: Product[];
  loading: boolean;
}

export default function BirthdayDeco() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎂 Specific Category ID for Birthday Decoration
  const ONLY_CATEGORY_ID = 0;

  useEffect(() => {
    fetchCategoryByID();
  }, []);

  const fetchCategoryByID = async () => {
    try {
      setLoading(true);

      // 1. Fetch Categories to get the specific name/slug for ID 12
      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();
      const selectedCategory = categoriesData?.categories?.find(
        (cat: Category) => cat.id === ONLY_CATEGORY_ID
      );

      // 2. Fetch products with a high limit to ensure you get all 51 items
      // We add ?limit=100 to bypass the default pagination of 10
      const productsRes = await fetch("/api/products?limit=100");
      const productsData = await productsRes.json();

      // 3. Filter on the frontend
      // This ensures ONLY products with category_id: 12 are stored in state
      const allProducts = productsData?.products || [];
      const filteredProducts = allProducts.filter(
        (p: any) => p.category_id === ONLY_CATEGORY_ID
      );

      console.log(`✅ Found ${filteredProducts.length} products for Birthday Deco`);

      if (selectedCategory) {
        setCategoriesWithProducts([
          {
            category: selectedCategory,
            products: filteredProducts,
            loading: false,
          },
        ]);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };


  /* =======================
      HELPERS
  ======================= */
  const calculateDiscount = (price: number, sellingPrice: number) => {
    if (price > sellingPrice) {
      return Math.round(((price - sellingPrice) / price) * 100);
    }
    return 0;
  };

  const renderProductCard = (product: Product) => {
    // Convert string prices from API to numbers for calculation
    const priceNum = Number(product.price);
    const sellingPriceNum = Number(product.sellingPrice);
    const discount = calculateDiscount(priceNum, sellingPriceNum);

    const imageUrl = product.productImage || "/assets/home/birthday_deco/1.jpg";

    return (
      <Link key={product.id} href={`/product-details/${product.id}`} className="group cursor-pointer">
        <div className="overflow-hidden rounded-lg mb-4">
          <img
            src={imageUrl}
            alt={product.productName}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="px-2">
          <span className="text-yellow-400 block">★★★★★</span>
          <p className="text-sm md:text-base font-medium mb-2 line-clamp-2">
            {product.productName}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg">₹{sellingPriceNum}</span>
            {priceNum > sellingPriceNum && (
              <>
                <span className="text-gray-400 line-through text-sm">₹{priceNum}</span>
                {discount > 0 && (
                  <span className="border border-[#93F8C5] rounded-xl px-2 py-0.5 text-[10px] font-medium text-[#016136] bg-green-50">
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

  const renderCategorySection = (categoryData: CategoryWithProducts) => {
    const { category, products } = categoryData;

    return (
      <div key={category.id} className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">
            {category.name}
          </h3>

          <Link
            href={`/view-all?category_id=${category.id}&name=${encodeURIComponent(category.name)}`}
            className="text-pink-600 underline text-sm"
          >
            View All
          </Link>

        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {products.map(renderProductCard)}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <div className="h-8 bg-gray-200 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}><div className="aspect-square bg-gray-200 rounded-lg mb-4" /><div className="h-4 bg-gray-200 w-3/4" /></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {categoriesWithProducts.slice(0, 4).map(renderCategorySection)}
    </div>
  );
}