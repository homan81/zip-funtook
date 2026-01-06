// import Image from "next/image";
// import { Swiper, SwiperSlide } from 'swiper/react';


// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// export default function viewall() {
//   return (
//     <div className="w-full container mx-auto px-6 py-4 md:px-4 md:py-10">
//       <div className=" flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-5">
//         <p className="text-left text-2xl md:text-3xl font-semibold bg-black bg-clip-text text-transparent">
//           Birthday Decoration
//         </p>

//         {/* Products + Rating (Hidden on mobile) */}
//         <div className="hidden sm:flex items-center gap-4">
//           <p>155 Products</p>
//           <span>|</span>
//           <div className="flex items-center gap-1">
//             <p className="text-[#2BAC17]">★ 4.5</p>
//             <p>reviews</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col items-start overflow-x-scroll md:overflow-hidden">
//         <div className="flex gap-6 sm:gap-[57px] justify-center mb-10">
//           <div className="flex flex-col items-center text-center">
//             <img
//               src="/images/Ellipse 35.svg"
//               className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
//             />
//             <span className="text-xs md:text-sm mt-2">Kids Birthday</span>
//           </div>
//           <div className="flex flex-col items-center text-center">
//             <img
//               src="/images/Ellipse 35.svg"
//               className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
//             />
//             <span className="text-xs md:text-sm mt-2">Kids Birthday</span>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <img
//               src="/images/Ellipse 35.svg"
//               className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
//             />
//             <span className="text-xs md:text-sm mt-2">Kids Birthday</span>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <img
//               src="/images/Ellipse 35.svg"
//               className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
//             />
//             <span className="text-xs md:text-sm mt-2">Kids Birthday</span>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <img
//               src="/images/Ellipse 35.svg"
//               className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
//             />
//             <span className="text-xs md:text-sm mt-2">Kids Birthday</span>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <img
//               src="/images/Ellipse 35.svg"
//               className="max-w-[100px] sm:max-w-none sm:w-40 rounded-full"
//             />
//             <span className="text-xs md:text-sm mt-2">Kids Birthday</span>
//           </div>
//         </div>
//       </div>

//       <div className="w-full bg-[#E7E7E7] rounded-lg px-3 py-2 flex items-center justify-between">
//         {/* Left Text */}
//         <p className="text-xs sm:text-sm text-black">Showing 12 Results...</p>

//         {/* Right Sort By */}
//         <div className="flex items-center gap-2 cursor-pointer">
//           <img src="/images/sort.svg" className="w-4 sm:w-5" />
//           <span className="text-xs sm:text-sm text-black">Sort By</span>
//         </div>
//       </div>

//       {/* one */}
//       <div className="mt-4 overflow-x-scroll md:overflow-hidden">
//         <div className="min-w-[700px] *:w-[25%] flex w-full gap-4 [&_p]:text-center [&_p]:text-black [&_p]:lg:text-lg [&_p]:text-md [&_p]:my-4 [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg">
//           <div>
//             <img
//               src="/images/room decor.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/cardecor.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/livingroomdecor.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/bdaydecor.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* two */}
//       <div className="mt-4 overflow-x-scroll md:overflow-hidden">
//         <div className="min-w-[700px] flex *:w-[25%] w-full gap-4 [&_p]:text-center [&_p]:text-black [&_p]:lg:text-lg [&_p]:text-md [&_p]:my-4 [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg">
//           <div>
//             <img
//               src="/images/21bday.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/colorballon.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/topdecor.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/roomdecors.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* three */}
//       <div className="mt-4 overflow-x-scroll md:overflow-hidden">
//         <div className="min-w-[700px] *:w-[25%] flex w-full gap-4 [&_p]:text-center [&_p]:text-black [&_p]:lg:text-lg [&_p]:text-md [&_p]:my-4 [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg">
//           <div>
//             <img
//               src="/images/babyshower.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/topseller.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/ballons.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/images/bossday.svg"
//               className="w-full aspect-square object-cover rounded-lg mb-2"
//             />
//             <div className="px-2 py-4">
//               <div className="flex flex-col leading-none">
//                 <span className="text-yellow-400">★★★★★</span>
//                 <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
//                   Shinny Birthday decors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-[22px]">₹4399</span>
//                 <span className="text-gray-400 line-through text-sm">
//                   ₹8499
//                 </span>
//                 <span  className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
//                   17% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// interface Product {
//   id: number;
//   productName: string;
//   productImage: string | null;
//   price: number;
//   sellingPrice: number;
//   discountPercent: number;
//   stockQuantity: number;
//   category: string;
//   subcategory: string | null;
// }

// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   image: string | null;
// }

// interface Subcategory {
//   id: number;
//   name: string;
//   slug: string;
//   category_id: number;
//   image: string | null;
// }

// interface ProductResponse {
//   success: boolean;
//   products: Product[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     itemsPerPage: number;
//     hasNextPage: boolean;
//     hasPreviousPage: boolean;
//   };
// }

// export default function ViewAllPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState<any>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [sortOption, setSortOption] = useState<string>("newest");

//   const searchParams = useSearchParams();
//   const categoryFromUrl = searchParams.get("category");
//   const subcategoryFromUrl = searchParams.get("subcategory");

//   // Fetch categories and subcategories
//   useEffect(() => {
//     const fetchCategoriesAndSubcategories = async () => {
//       try {
//         const [categoriesRes, subcategoriesRes] = await Promise.all([
//           fetch("/api/categories"),
//           fetch("/api/subcategories")
//         ]);

//         if (!categoriesRes.ok || !subcategoriesRes.ok) {
//           throw new Error("Failed to fetch categories or subcategories");
//         }

//         const categoriesData = await categoriesRes.json();
//         const subcategoriesData = await subcategoriesRes.json();

//         setCategories(categoriesData.categories || []);
//         setSubcategories(subcategoriesData.subcategories || []);
//       } catch (err) {
//         console.error("Error fetching categories/subcategories:", err);
//       }
//     };

//     fetchCategoriesAndSubcategories();
//   }, []);

//   // Set initial category from URL
//   useEffect(() => {
//     if (categoryFromUrl) {
//       // Decode the category name from URL
//       const decodedCategory = decodeURIComponent(categoryFromUrl);
//       setSelectedCategory(decodedCategory);
//     } else {
//       setSelectedCategory("");
//     }
//     if (subcategoryFromUrl) {
//       // Decode the subcategory name from URL
//       const decodedSubcategory = decodeURIComponent(subcategoryFromUrl);
//       setSelectedSubcategory(decodedSubcategory);
//     } else {
//       setSelectedSubcategory("");
//     }
//     // Reset pagination when URL parameters change
//     setPage(1);
//   }, [categoryFromUrl, subcategoryFromUrl]);

//   // Fetch products when filters change
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const params = new URLSearchParams({
//           page: page.toString(),
//           limit: "20",
//           sortBy: sortOption,
//         });

//         if (selectedCategory) {
//           params.append("category", selectedCategory);
//         }
//         if (selectedSubcategory) {
//           params.append("subcategory", selectedSubcategory);
//         }

//         const response = await fetch(`/api/products?${params}`);
//         const result: ProductResponse = await response.json();

//         if (!response.ok || !result.success) {
//           const errorData = await response.json();
//           throw new Error(errorData?.message || "Failed to fetch products");
//         }

//         setProducts(result.products);
//         setPagination(result.pagination);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [page, selectedCategory, selectedSubcategory, sortOption]);

//   // Filter subcategories based on selected category
//   const filteredSubcategories = subcategories.filter(sub => 
//     selectedCategory 
//       ? categories.find(cat => cat.name === selectedCategory)?.id === sub.category_id
//       : true
//   );

//   const calculateDiscount = (price: number, sellingPrice: number) => {
//     if (price > sellingPrice) {
//       return Math.round(((price - sellingPrice) / price) * 100);
//     }
//     return 0;
//   };

//   return (
//     <div className="w-full container mx-auto px-4 py-4 md:px-4 md:py-10">
//       {/* Header with category and subcategory selectors */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-5">
//           <h1 className="text-left text-2xl md:text-3xl font-semibold bg-black bg-clip-text text-transparent">
//             {selectedCategory || "All Products"}
//           </h1>

//           {/* Products + Rating (Hidden on mobile) */}
//           <div className="hidden sm:flex items-center gap-4">
//             <p>{pagination?.totalItems || 0} Products</p>
//             <span>|</span>
//             <div className="flex items-center gap-1">
//               <p className="text-[#2BAC17]">★ 4.5</p>
//               <p>reviews</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => {
//                 setSelectedCategory(e.target.value);
//                 setSelectedSubcategory(""); // Reset subcategory when category changes
//                 setPage(1); // Reset to first page
//               }}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88]"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.name}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
//             <select
//               value={selectedSubcategory}
//               onChange={(e) => {
//                 setSelectedSubcategory(e.target.value);
//                 setPage(1); // Reset to first page
//               }}
//               disabled={!selectedCategory || filteredSubcategories.length === 0}
//               className="w-full p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] disabled:opacity-50"
//             >
//               <option value="">All Subcategories</option>
//               {filteredSubcategories.map((sub) => (
//                 <option key={sub.id} value={sub.name}>
//                   {sub.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
//             <select
//               value={sortOption}
//               onChange={(e) => {
//                 setSortOption(e.target.value);
//                 setPage(1); // Reset to first page
//               }}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88]"
//             >
//               <option value="newest">Newest</option>
//               <option value="price-low-high">Price: Low to High</option>
//               <option value="price-high-low">Price: High to Low</option>
//               <option value="discount">Discount</option>
//               <option value="name">Name</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Results Info and Sort */}
//       <div className="w-full bg-[#E7E7E7] rounded-lg px-3 py-2 flex flex-col sm:flex-row items-center justify-between mb-6">
//         <p className="text-xs sm:text-sm text-black mb-2 sm:mb-0">
//           Showing {products.length} of {pagination?.totalItems || 0} Results
//         </p>

//         <div className="flex items-center gap-2 cursor-pointer">
//           <img src="/images/sort.svg" className="w-4 sm:w-5" />
//           <span className="text-xs sm:text-sm text-black">Sort By</span>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC6E88]"></div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !loading && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
//           <p className="font-semibold">Error:</p>
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Products Grid */}
//       {!loading && !error && products.length > 0 && (
//         <div className="space-y-8">
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {products.map((product) => (
//               <Link 
//                 href={`/products/${product.id}`} 
//                 key={product.id} 
//                 className="group block"
//               >
//                 <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
//                   {/* Product Image */}
//                   <div className="relative h-48 bg-gray-100">
//                     <Image
//                       src={product.productImage || "/images/room decor.svg"}
//                       alt={product.productName}
//                       fill
//                       className="object-cover group-hover:scale-105 transition-transform duration-300"
//                       sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
//                     />
//                     {product.discountPercent > 0 && (
//                       <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//                         {product.discountPercent}% OFF
//                       </div>
//                     )}
//                   </div>

//                   {/* Product Details */}
//                   <div className="p-3">
//                     <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[40px] text-sm">
//                       {product.productName}
//                     </h3>

//                     {/* Price */}
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="text-sm font-bold text-[#FC6E88]">
//                         ₹{product.sellingPrice}
//                       </span>
//                       {product.price > product.sellingPrice && (
//                         <span className="text-xs text-gray-400 line-through">
//                           ₹{product.price}
//                         </span>
//                       )}
//                     </div>

//                     {/* Stock Info */}
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <span
//                         className={
//                           product.stockQuantity > 0
//                             ? "text-green-600"
//                             : "text-red-600"
//                         }
//                       >
//                         {product.stockQuantity > 0
//                           ? `${product.stockQuantity} in stock`
//                           : "Out of stock"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 bg-white rounded-lg shadow p-4">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={!pagination.hasPreviousPage}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
//               >
//                 Previous
//               </button>

//               <span className="text-gray-70 font-medium">
//                 Page {pagination.currentPage} of {pagination.totalPages}
//                 <span className="text-gray-50 text-sm ml-2">
//                   ({pagination.totalItems} products)
//                 </span>
//               </span>

//               <button
//                 onClick={() => setPage((p) => p + 1)}
//                 disabled={!pagination.hasNextPage}
//                 className="px-4 py-2 bg-[#FC6E88] hover:bg-[#e55d77] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && !error && products.length === 0 && (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <p className="text-gray-500 text-lg">
//             No products found in this category.
//           </p>
//           <p className="text-gray-400 mt-2">
//             Try selecting a different category or check back later.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// interface Product {
//   id: number;
//   productName: string;
//   productImage: string | null;
//   price: number;
//   sellingPrice: number;
//   discountPercent: number;
//   stockQuantity: number;
// }

// export default function ViewAll() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState<any>(null);
//   const [sortOption, setSortOption] = useState<string>("newest");

//   const searchParams = useSearchParams();
//   const categoryFromUrl = searchParams.get("category");

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams({
//           page: page.toString(),
//           limit: "20",
//           sortBy: sortOption,
//         });
//         if (categoryFromUrl) params.append("category", categoryFromUrl);

//         const res = await fetch(`/api/products?${params}`);
//         const data = await res.json();

//         if (!res.ok || !data.success) throw new Error(data?.message || "Failed to fetch");

//         setProducts(data.products);
//         setPagination(data.pagination);
//       } catch (err) {
//         console.error(err);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [page, sortOption, categoryFromUrl]);

//   return (
//     <div className="w-full container mx-auto px-6 py-4 md:px-4 md:py-10">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-5">
//         <p className="text-left text-2xl md:text-3xl font-semibold bg-black bg-clip-text text-transparent">
//           {categoryFromUrl ? decodeURIComponent(categoryFromUrl) : "All Products"}
//         </p>

//         <div className="hidden sm:flex items-center gap-4">
//           <p>{pagination?.totalItems || 0} Products</p>
//           <span>|</span>
//           <div className="flex items-center gap-1">
//             <p className="text-[#2BAC17]">★ 4.5</p>
//             <p>reviews</p>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       {loading ? (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC6E88]"></div>
//         </div>
//       ) : products.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <p className="text-gray-500 text-lg">No products found in this category.</p>
//           <p className="text-gray-400 mt-2">Try a different category or check back later.</p>
//         </div>
//       ) : (
//         <>
//           <div className="mt-4 overflow-x-scroll md:overflow-hidden">
//             <div className="min-w-[700px] flex w-full gap-4 [&_p]:text-center [&_p]:text-black [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg">
//               {products.map((product) => (
//                 <Link
//                   href={`/products/${product.id}`}
//                   key={product.id}
//                   className="w-[25%] flex-shrink-0"
//                 >
//                   <img
//                     src={product.productImage || "/images/room decor.svg"}
//                     className="w-full aspect-square object-cover rounded-lg mb-2"
//                   />
//                   <div className="px-2 py-4">
//                     <div className="flex flex-col leading-none">
//                       <span className="text-yellow-400">★★★★★</span>
//                       <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-3">
//                         {product.productName}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-[22px]">₹{product.sellingPrice}</span>
//                       {product.price > product.sellingPrice && (
//                         <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
//                       )}
//                       {product.discountPercent > 0 && (
//                         <span className="border border-[#93F8C5] rounded-xl px-1.5 py-0.5 text-[10px] font-medium text-[#016136] bg-gradient-to-r from-[#91F8C5] to-white inline-flex items-center justify-center">
//                           {product.discountPercent}% OFF
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 bg-white rounded-lg shadow p-4 mt-6">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={!pagination.hasPreviousPage}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
//               >
//                 Previous
//               </button>

//               <span className="text-gray-700 font-medium">
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>

//               <button
//                 onClick={() => setPage((p) => p + 1)}
//                 disabled={!pagination.hasNextPage}
//                 className="px-4 py-2 bg-[#FC6E88] hover:bg-[#e55d77] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


import { Suspense } from "react";
import ViewAllClient from "./ViewAllClient";

export default function ViewAllPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading products...</div>}>
      <ViewAllClient />
    </Suspense>
  );
}


