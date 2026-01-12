// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Anniversary_deco from "./Anniversary_deco";
// import New_Collections from "./New_Collections";
// import Surprise_Love from "./Surprise_Love";
// import Kids_Birthday from "./Kids_Birthday";
// import Baby_Decor from "./Baby_Decor";
// import Baby_Shower from "./Baby_Shower";
// import Hampers from "./Hampers";
// import Section_11 from "./Section_11";
// import Freq_ques from "./Freq_ques";
// import Book_Decors from "./Book _Decors";
// import Service_Bars from "./Service_Bars";
// import { useEffect, useState } from "react";



// export default function BirthdayDeco() {

//   const router = useRouter();
//   const handleClick = () => {
//     // Navigate to product details page
//     // You can pass product ID dynamically if needed
//     router.push("/product-details"); // replace 1 with your product ID
//   };


//   return (
// <div className="mx-auto">

//   {/* bir_deco code  */}
//   <div className="container mx-auto p-4">
//     <div
//       id="Birthday"
//       className=" flex justify-between items-center mb-5 scroll-mt-24"
//     >
//       <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
//         Birthday Decoration
//       </h3>
//       <Link
//         href="/view-all"
//         className="text-(--pinkd) underline text-[12px] sm:text-sm"
//       >
//         View All
//       </Link>
//     </div>

//     <div
//       onClick={handleClick}
//       className="overflow-x-scroll md:overflow-hidden cursor-pointer"
//     >
//       <div className="min-w-[700px] flex w-full gap-4 [&_p]:text-center [&_p]:text-black [&_p]:lg:text-lg [&_p]:text-md [&_p]:my-4 [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg">
//         <div>
//           <img
//             src="/assets/home/birthday_deco/1.jpg"
//             alt="aniversary_deco"
//           />
//           <div className="px-2 py-4">
//             <div className="flex flex-col leading-none">
//               <span className="text-yellow-400">★★★★★</span>
//               <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                 Colorful Magical Balloon
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="font-[22px]">₹2999</span>
//               <span className="text-gray-400 line-through text-sm">
//                 ₹3699
//               </span>
//               <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                 17% OFF
//               </span>
//             </div>
//           </div>
//         </div>
//         <div onClick={handleClick} className="cursor-pointer">
//           <img src="/assets/home/birthday_deco/2.jpg" alt="birthday_deco" />
//           <div className="px-2 py-4">
//             <div className="flex flex-col leading-none">
//               <span className="text-yellow-400">★★★★★</span>
//               <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                 Magical Birthday Decoration
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="font-[22px]">₹2199</span>
//               <span className="text-gray-400 line-through text-sm">
//                 ₹3699
//               </span>
//               <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                 17% OFF
//               </span>
//             </div>
//           </div>
//         </div>
//         <div>
//           <img src="/assets/home/birthday_deco/3.jpg" alt="shower_deco" />
//           <div className="px-2 py-4">
//             <div className="flex flex-col leading-none">
//               <span className="text-yellow-400">★★★★★</span>
//               <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                 Party Balloon Backdrop Decors
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="font-[22px]">₹1999</span>
//               <span className="text-gray-400 line-through text-sm">
//                 ₹2999
//               </span>
//               <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                 17% OFF
//               </span>
//             </div>
//           </div>
//         </div>
//         <div>
//           <img src="/assets/home/birthday_deco/4.jpg" alt="kids_deco" />
//           <div className="px-2 py-4">
//             <div className="flex flex-col leading-none">
//               <span className="text-yellow-400">★★★★★</span>
//               <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                 Black Golden Arcs Decoration
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="font-[22px]">₹4399</span>
//               <span className="text-gray-400 line-through text-sm">
//                 ₹8499
//               </span>
//               <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                 23% OFF
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

//       <Anniversary_deco />
//       <New_Collections />
//       <Surprise_Love />
//       <Kids_Birthday />
//       <Baby_Decor />
//       <Baby_Shower />
//       <Hampers />
//       <Service_Bars />
//       <Section_11 />
//       <Freq_ques />
//       <Book_Decors />

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Kids_Birthday from "./Kids_Birthday";
import New_Collections from "./New_Collections";
import Service_Bars from "./Service_Bars";
import Baby_Decor from "./Baby_Decor";
import Baby_Shower from "./Baby_Shower";
import Hampers from "./Hampers";
import Anniversary_deco from "./Anniversary_deco";
import Surprise_Love from "./Surprise_Love";
import Section_11 from "./Section_11";
import Freq_ques from "./Freq_ques";
import Book_Decors from "./Book _Decors";
import Customers from "../About/Customers";
import Mobilebottomtabs from "../Mobilebottomtabs/Mobilebottomtabs";


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
  price: number;
  sellingPrice: number;
  stockQuantity: number;
  category: string;
}

interface CategoryWithProducts {
  category: Category;
  products: Product[];
  loading: boolean;
}

export default function BirthdayDeco() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // CONFIGURATION: Categories to Hide/Exclude
  // ============================================
  // Agar kisi category ko hide karna ho, toh uske name ko yahan add karein
  // Example: ["Category Name 1", "Category Name 2"]
  // Case-insensitive matching - "birthday decoration" aur "Birthday Decoration" dono match honge
  const EXCLUDED_CATEGORIES: string[] = [
    // Add category names here that you want to hide
    // Example: "Some Category Name",
    "Surprising Loved Once Decoration",
  ];

  useEffect(() => {
    fetchAllCategoriesAndProducts();
  }, []);

  const fetchAllCategoriesAndProducts = async () => {
    try {
      setLoading(true);

      // Fetch all categories from database
      const categoriesRes = await fetch("/api/categories");
      if (!categoriesRes.ok) {
        console.error("Failed to fetch categories");
        setLoading(false);
        return;
      }

      const categoriesData = await categoriesRes.json();
      const allCategories: Category[] = categoriesData?.categories || [];

      if (allCategories.length === 0) {
        setLoading(false);
        return;
      }

      // Filter out excluded categories (case-insensitive)
      const filteredCategories = allCategories.filter((category) => {
        const categoryNameLower = category.name.toLowerCase();
        return !EXCLUDED_CATEGORIES.some(
          (excluded) => excluded.toLowerCase() === categoryNameLower
        );
      });

      if (filteredCategories.length === 0) {
        console.log("No categories to display after filtering");
        setLoading(false);
        return;
      }

      // Fetch products for each category
      const categoryPromises = filteredCategories.map(async (category) => {
        try {
          const productsRes = await fetch(
            `/api/products?category=${encodeURIComponent(category.name)}&limit=4`
          );

          if (!productsRes.ok) {
            return {
              category,
              products: [],
              loading: false,
            };
          }

          const productsData = await productsRes.json();
          const products: Product[] = productsData?.products?.slice(0, 4) || [];

          return {
            category,
            products,
            loading: false,
          };
        } catch (error) {
          console.error(`Error fetching products for ${category.name}:`, error);
          return {
            category,
            products: [],
            loading: false,
          };
        }
      });

      const results = await Promise.all(categoryPromises);
      setCategoriesWithProducts(results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (price: number, sellingPrice: number) => {
    if (price > sellingPrice) {
      return Math.round(((price - sellingPrice) / price) * 100);
    }
    return 0;
  };

  // const renderProductCard = (product: Product) => {
  //   const discount = calculateDiscount(product.price, product.sellingPrice);

  //   // this is final 
  //   // const imageUrl =
  //   //   product.productImage || "/assets/home/explore/birthday_deco.jpg";

  //   const imageUrl =
  //     product.productImage &&
  //       product.productImage.startsWith("/uploads/")
  //       ? product.productImage
  //       : "/assets/home/birthday_deco/1.jpg";

  //   return (
  //     // <Link
  //     //   key={product.id}
  //     //   href={`/products/${product.id}`}
  //     // >
  //     <Link href={`/product-details/${product.id}`}>
  //       <img
  //         src={imageUrl}
  //         alt={product.productName}
  //         className="w-full object-cover rounded-lg"
  //       />

  //       <div className="px-2 py-4">
  //         <div className="flex flex-col leading-none">
  //           <span className="text-yellow-400">★★★★★</span>
  //           <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
  //             {product.productName}
  //           </span>
  //         </div>

  //         <div className="flex items-center gap-2">
  //           <span className="font-[22px]">₹{product.sellingPrice}</span>

  //           {product.price > product.sellingPrice && (
  //             <>
  //               <span className="text-gray-400 line-through text-sm">
  //                 ₹{product.price}
  //               </span>

  //               {discount > 0 && (
  //                 <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
  //                   {discount}% OFF
  //                 </span>
  //               )}
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </Link>
  //   );
  // };

  const renderProductCard = (product: Product) => {
    const discount = calculateDiscount(product.price, product.sellingPrice);

    const imageUrl =
      product.productImage &&
        product.productImage.trim() !== "" &&
        product.productImage.startsWith("/uploads/")
        ? product.productImage
        : "/assets/home/birthday_deco/1.jpg";


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

  // const renderCategorySection = (
  //   categoryData: CategoryWithProducts,
  //   index: number
  // ) => {
  //   const { category, products, loading } = categoryData;
  //   const sectionId = category.slug || `category-${category.id}`;

  //   return (
  //     <div
  //       key={category.id}
  //       className={`${index > 0 ? "mt-10" : ""} container mx-auto p-4`}
  //     >
  //       {/* Header */}
  //       <div
  //         id={sectionId}
  //         className="flex justify-between items-center mb-5 scroll-mt-24"
  //       >
  //         <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
  //           {category.name}
  //         </h3>

  //         <Link
  //           href={`/view-all?category=${encodeURIComponent(category.name)}`}
  //           className="text-(--pinkd) underline text-[12px] sm:text-sm"
  //         >
  //           View All
  //         </Link>
  //       </div>

  //       {/* Products Grid */}
  //       {loading ? (
  //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  //           {[1, 2, 3, 4].map((i) => (
  //             <div key={i} className="animate-pulse">
  //               <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
  //               <div className="h-4 bg-gray-200 rounded mb-2" />
  //               <div className="h-4 bg-gray-200 rounded w-2/3" />
  //             </div>
  //           ))}
  //         </div>
  //       ) : products.length > 0 ? (
  //         <div
  //           className="grid grid-cols-2 sm:grid-cols-4 gap-4 cursor-pointer"
  //         >
  //           {products.map(renderProductCard)}
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // };

  const renderCategorySection = (
    categoryData: CategoryWithProducts,
    index: number
  ) => {
    const { category, products, loading } = categoryData;
    const sectionId = category.slug || `category-${category.id}`;

    return (
      <div
        key={category.id}
        className={`${index > 0 ? "sm:mt-10 mt-5" : ""} container mx-auto p-4`}
      >
        {/* Header */}
        <div
          id={sectionId}
          className="flex justify-between items-center mb-5 scroll-mt-24"
        >
          <h3 className="text-[16px] sm:text-[18px] lg:text-[27px] font-semibold">
            {category.name}
          </h3>

          <Link
            href={`/view-all?category=${encodeURIComponent(category.name)}`}
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
  };

  return (
    <div>
      {/* <div className="text-center mb-15 headings_border">
        <h2 className="font-bold text-[34px]">Explore</h2>
        <p className="text-[18px] text-(--subhead)">Wide Range Of Options</p>
      </div> */}

      {/* Dynamic Categories with Products */}
      {loading ? (
        <div className="container mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-5"></div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[25%]">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        categoriesWithProducts.map((categoryData, index) =>
          renderCategorySection(categoryData, index)
        )
      )}

      {/* The Anniversary Decoration Section */}
      <Anniversary_deco />

      {/* The New Collections Section */}
      <New_Collections />

      {/* The New Collections Section */}
      <Surprise_Love />

      {/* Kids Birthday Themes Section */}
      <Kids_Birthday />

      {/* Welcome Baby Decoration Section */}
      <Baby_Decor />

      {/* Baby Shower Decoration Section */}
      <Baby_Shower />

      {/* Balloon Hampers Section */}
      <Hampers />
      {/* Service Info Section */}
      <Service_Bars />
      {/* Section_11 Section */}

      <Customers />

      <Section_11 />
      {/* Freq_ques Section */}
      <Freq_ques />
      {/* Book_Decors Section */}
      <Book_Decors />

      <Mobilebottomtabs />

    </div>
  );
}

