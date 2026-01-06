// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import ProductDetails from "@/app/(site)/components/product-details/ProductDetails";

// export default function ProductPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("Slug from URL 👉", slug);

//     if (!slug) return;

//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`/api/products/${slug}`);
//         const data = await res.json();

//         console.log("API Status 👉", res.status);
//         console.log("API Data 👉", data);

//         if (!res.ok || !data) {
//           setProduct(null);
//         } else {
//           setProduct(data.product ?? data);
//         }
//       } catch (err) {
//         console.error("Fetch error 👉", err);
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (!product) return <p className="p-6">Product not found</p>;

//   return <ProductDetails product={product} />;
// }


// import Image from "next/image";
// import ProductDetails from "../components/product-details/ProductDetails";
// import ProductZoom from "../components/ProductZoom/productzoom";
// import { HiCode } from "react-icons/hi";

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from 'next/navigation';

interface FAQ {
    question: string;
    answer: string;
}

interface Product {
    id: number;
    productName: string;
    slug: string;
    description: string;

    category_name?: string;
    subcategory_name?: string;

    productImage: string;
    price: number;
    sellingPrice: number;
    discountPercent: number;

    quantity: number;
    unit: string;
    stockQuantity: number;

    locationAvailability: string[];
    product_tags: string[];

    metaTitle?: string;
    metaKeywords?: string;
    metaDescription?: string;

    gallery: { image: string }[];

    faqs: FAQ[]; // ✅ USE FAQ TYPE HERE

    packageInclusion: string[];
    deliveryDetails: string[];
    careInfo: string[];

    variants: {
        id: number;
        name: string;
        options: string[];
    }[];
}

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState("");
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [status, setStatus] = useState<"available" | "not_available" | null>(null);


    // const handleBookOrder = () => {
    //     const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    //     const existingItem = cart.find(
    //         (item: any) => item.productId === product?.id
    //     );

    //     if (existingItem) {
    //         existingItem.quantity += 1;
    //     } else {
    //         cart.push({
    //             productId: product?.id,
    //             productName: product?.productName,
    //             productImage: product?.productImage,
    //             price: product?.price,
    //             sellingPrice: product?.sellingPrice,
    //             quantity: 1,
    //         });
    //     }

    //     localStorage.setItem('cart', JSON.stringify(cart));
    //     router.push('/Your-Cart');
    // };

    const handleBookOrder = () => {
        // ❌ City empty
        if (!city.trim()) {
            setError("Please fill city name to proceed");
            return;
        }

        // ❌ City not available
        if (status !== "available") {
            setError("Service is not available in this city");
            return;
        }

        // ✅ Continue normal flow
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingItem = cart.find(
            (item: any) => item.productId === product?.id
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: product?.id,
                productName: product?.productName,
                productImage: product?.productImage,
                price: product?.price,
                sellingPrice: product?.sellingPrice,
                quantity: 1,
                city: city, // 🔥 optional: save city
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        router.push("/Your-Cart");
    };

    const checkCityAvailability = async (cityName: string) => {
        if (!cityName) {
            setStatus(null);
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/products/");
            const data = await res.json();

            const isAvailable = data.products.some((product: any) => {
                if (!product.locationAvailability) return false;

                const locations = JSON.parse(product.locationAvailability); // 🔥 important
                return locations.some(
                    (loc: string) => loc.toLowerCase() === cityName.toLowerCase()
                );
            });

            setStatus(isAvailable ? "available" : "not_available");
        } catch (err) {
            console.error(err);
            setStatus("not_available");
        }
    };

    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                // const response = await fetch(`/api/products/slug/${slug}`);
                const response = await fetch(`/api/products/${slug}`);

                const data = await response.json();

                if (data.success) {
                    setProduct(data.product);
                } else {
                    setError(data.message || "Product not found");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="w-full container mx-auto px-2 py-4 md:px-4 md:py-10 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC6E88] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full container mx-auto px-2 py-4 md:px-4 md:py-10 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        {error || "Product not found"}
                    </h2>
                    <Link
                        href="/"
                        className="text-[#FC6E88] hover:underline font-semibold"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const allImages = [
        product.productImage,
        ...product.gallery.map((g) => g.image),
    ].filter(Boolean);

    return (
        <div className="w-full container mx-auto px-2 py-4 md:px-4 md:py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left - Image Gallery */}
                <div className="flex flex-col items-center h-fit top-5 md:sticky">
                    <ImageGalleryWithZoom images={allImages} productName={product.productName} />
                </div>

                {/* Right - Product Details */}
                <div className="px-3 py-3">
                    <div className="border rounded border-[#FFDDDD] bg-[#FFDDDD] px-2 w-fit text-sm">
                        <p className="flex gap-2 text-[#FF6A9E]">
                            <img src="/images/game.svg" />
                            #1 Decoration website in India
                        </p>
                    </div>

                    {/* Responsive Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-4xl  mt-2">
                        {product.productName}
                    </h2>

                    {/* Category & Subcategory */}
                    {/* {(product.category_name || product.subcategory_name) && (
                        <div className="flex items-center gap-2 mt-3 mb-3">
                            {product.category_name && (
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {product.category_name}
                                </span>
                            )}
                            {product.subcategory_name && (
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {product.subcategory_name}
                                </span>
                            )}
                        </div>
                    )} */}

                    {/* Price Section */}
                    <div className="flex items-center gap-2 text-2xl sm:text-3xl mt-4">
                        <span className="font-[22px]">₹{product.sellingPrice}</span>
                        {product.price > product.sellingPrice && (
                            <span className="text-gray-400 line-through text-sm"> ₹{product.price}</span>
                        )}
                        {product.discountPercent > 0 && (
                            <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
                                {product.discountPercent}% OFF
                            </span>
                        )}
                    </div>

                    <span className="text-gray-400 text-[12px] sm:text-sm">
                        Including all charges
                    </span>

                    {/* Stock & Quantity */}
                    {/* <div className="flex items-center gap-4 mt-3 mb-4">
                        <span className="text-sm text-gray-600">
                            Quantity: {product.quantity} {product.unit}
                        </span>
                        <span
                            className={`text-sm font-semibold ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {product.stockQuantity > 0
                                ? `${product.stockQuantity} in stock`
                                : "Out of stock"}
                        </span>
                    </div> */}

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-400 text-xl sm:text-2xl md:text-3xl">
                            ★★★★★
                        </span>
                        <span className="text-[#616161]">(4.8)|</span>
                        <span className="text-[#566AFF]">170 reviews</span>
                    </div>

                    {/* Similar products shortcut */}
                    <div className="flex items-center gap-1 mb-1">
                        <span className="bg-[#CFCFCF] text-[12px] px-4 py-1 rounded">
                            Similar products →
                        </span>
                    </div>

                    <div className="mt-5 bg-white rounded-xl border border-gray-200 p-4">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Select Your City
                            </h3>

                            <div className="flex items-center gap-1 text-xs text-purple-600">
                                <span className="border border-purple-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                    i
                                </span>
                                <span>Date and Time will be taken in the next step</span>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </span>

                            <input
                                type="text"
                                value={city}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCity(value);
                                    setError(null);
                                    checkCityAvailability(value);
                                }}
                                placeholder="Type your city name..."
                                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none
                                    ${error
                                        ? "bg-red-200"
                                        : status === "available"
                                            ? "bg-green-100"
                                            : status === "not_available"
                                                ? "bg-red-100"
                                                : "bg-gray-100"
                                    }
                                `}
                            />

                        </div>
                        {status === "available" && (
                            <p className="text-green-600 text-xs mt-2">
                                ✅ Service available in this city
                            </p>
                        )}

                        {status === "not_available" && (
                            <p className="text-red-600 text-xs mt-2">
                                ❌ Service not available in this city
                            </p>
                        )}

                    </div>

                    {/* Product Details Accordion */}
                    <ProductDetailsAccordion
                        product={product}
                        openAccordion={openAccordion}
                        setOpenAccordion={setOpenAccordion}
                    />

                    {/* Offer Box */}
                    {/* <div className="mt-10 border border-[#E7E7E7] rounded-3xl">
                        <div className="bg-[#FBEFCE] p-4 flex gap-5 rounded-tl-[20px] rounded-tr-[20px]">
                            <div className="flex gap-2">
                                <img className="w-6 h-6 sm:w-5" src="/images/discount.png" alt="discount" />
                                <p className="text-[12px] sm:text-[15px]">
                                    Get <strong>Rs 100</strong> Off – Only on Website Bookings
                                </p>
                            </div>
                            <div>
                                <p className="text-[#FF6A9E] font-bold text-[10px] sm:text-[15px]">
                                    CODE: WELCOME
                                </p>
                            </div>
                        </div>

                        <div className="p-5 flex gap-5 justify-center">
                            <button className="flex items-center justify-center gap-2 w-full bg-white text-[#25BF31] border-2 border-[#25BF31] sm:px-5 sm:py-2 rounded shadow text-[12px] sm:text-[18px] p-[5px] hover:bg-[#25BF31] hover:text-white transition-colors">
                                <img
                                    src="/images/logos_whatsapp-icon.svg"
                                    className="w-5 h-5"
                                    alt="whatsapp"
                                />
                                Whatsapp
                            </button>

                            <button className="flex items-center justify-center w-full bg-[#FC6E88] text-white sm:px-5 sm:py-2 rounded shadow text-[12px] sm:text-[18px] p-[5px] hover:bg-[#e55d77] transition-colors">
                                Book your order →
                            </button>
                        </div>
                    </div> */}

                    {/* Offer Box */}
                    <div className="mt-10 border border-[#E7E7E7] rounded-3xl md:sticky bottom-0 bg-white">
                        <div className="bg-[#FBEFCE] p-4 flex gap-5 rounded-tl-[20px] rounded-tr-[20px]">
                            <div className="flex gap-2">
                                <img className="w-6 h-6 sm:w-5" src="/images/discount.png" />
                                <p className="text-[12px] sm:text-[15px]">
                                    Get <strong>Rs 100</strong> Off – Only on Website Bookings
                                </p>
                            </div>
                            <div>
                                <p className="text-(--pinkd) font-bold text-[10px] sm:text-[15px]">
                                    CODE: WELCOME
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="p-5 flex gap-5 justify-center">
                            {/* WhatsApp */}
                            <button className="flex items-center justify-center gap-2 w-full bg-white text-[#25BF31] border-2 border-[#25BF31] sm:px-5 sm:py-2 rounded shadow text-[12px] sm:text:[18px] p-[5px]">
                                <img
                                    src="/images/logos_whatsapp-icon.svg"
                                    className="w-5 h-5"
                                />
                                Whatsapp
                            </button>

                            {/* Call Button */}
                            {/* <button className="flex items-center justify-center w-full bg-(--pinkd) text-white sm:px-5 sm:py-2 rounded shadow text-[12px] sm:text:[18px] p-[5px]">
                                Book your order →
                            </button> */}
                            <button
                                onClick={handleBookOrder}
                                className="flex items-center justify-center w-full bg-(--pinkd) text-white sm:px-5 sm:py-2 rounded shadow text-[12px] sm:text:[18px] p-[5px]"
                            >
                                Book your order →
                            </button>
                        </div>
                        {/* </div> */}
                    </div>

                    {/* Trusted Box */}
                    <div className="mt-10 space-y-10">
                        <div className="border border-[#B8B8B8] bg-[#FCFCFC] rounded-2xl text-center space-y-3 shadow-sm">
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 m-0 mt-4">
                                    India’s Most Trusted
                                </p>

                                <h1 className="text-2xl sm:text-3xl font-bold text-[#FC6E88]">
                                    Funtook Decors
                                </h1>

                                <div className="flex flex-wrap justify-center gap-4 text-[14px] mt-3">
                                    <span className="flex items-center gap-2">
                                        <span className="text-green-500">🍃</span> Customized
                                        Decoration
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-green-500">🍃</span> Affordable
                                        Packages
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-green-500">🍃</span> Eco-Friendly
                                        Materials
                                    </span>
                                    <span className="hidden sm:flex items-center gap-2">
                                        <span className="text-green-500">🍃</span> 24×7 Support
                                    </span>
                                </div>
                            </div>

                            <button className="bg-[#FFDFE5] px-5 py-2 rounded-bl-2xl rounded-br-2xl text-[15px] font-medium mt-4 w-full">
                                Explore Our Recent Works →
                            </button>
                        </div>

                        {/* Ratings Section */}
                        <h2 className="text-center text-[22px] sm:text-[26px] font-semibold m-0 mb-4">
                            Rating & Review
                        </h2>

                        <div className="rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Left rating box */}
                            <div className="bg-[#FCFCFC] space-y-4 flex flex-col items-center border-t-2 rounded-tl-lg rounded-bl-lg border-t-[#0FC908] p-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        4.3
                                    </div>
                                    <p className="text-[14px] font-medium mt-1">Average Rating</p>
                                    <p className="text-gray-500 text-[13px]">
                                        Based on 1200 ratings
                                    </p>
                                </div>

                                {/* Bars */}
                                <div className="w-full space-y-2">
                                    {[90, 70, 50, 30, 15].map((w, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 text-[14px]"
                                        >
                                            <span className="w-14">{5 - i} star</span>
                                            <div className="flex-1 bg-gray-200 h-3 rounded">
                                                <div
                                                    className="bg-yellow-400 h-3 rounded"
                                                    style={{ width: `${w}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right reviews */}
                            <div className="space-y-4 flex flex-col justify-between">
                                {/* Review 1 */}
                                <div className="flex gap-3 p-3 bg-[#FCFCFC] border-t-[#0FC908] border-t-2 rounded-tr-lg">
                                    <img
                                        src="https://i.pravatar.cc/60"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-[15px]">Riya Sharma</p>
                                        <p className="text-yellow-500 text-[16px]">★★★★★</p>
                                        <p className="text-[12px] text-gray-700">
                                            Funtook made our celebration magical! Beautiful setup,
                                            timely service, and amazing team. Highly recommended!
                                        </p>
                                    </div>
                                </div>

                                {/* Review 2 */}
                                <div className="flex gap-3 p-3 bg-[#FCFCFC]">
                                    <img
                                        src="https://i.pravatar.cc/61"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-[15px]">Riya Sharma</p>
                                        <p className="text-yellow-500 text-[16px]">★★★★★</p>
                                        <p className="text-[12px] text-gray-700">
                                            Absolutely loved the setup! Every detail was perfect —
                                            vibrant, elegant, and exactly as promised. Great work,
                                            Funtook!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <input
                            placeholder="Write a review…"
                            className="w-full border border-green-300 rounded-lg p-3 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* SIMILAR PRODUCTS */}
            <div className="w-full px-4 py-3 flex items-center justify-between mt-4">
                <p className="text-lg font-bold text-gray-700">Similar products</p>

                <div className="flex items-center gap-2 cursor-pointer">
                    <img src="/images/left-line.svg" className="w-[26px]" />
                    <img src="/images/right-line.svg" className="w-[26px]" />
                </div>
            </div>

            <div className="mt-4 overflow-x-scroll md:overflow-hidden">
                <div className="min-w-full md:min-w-[700px] *:w-[25%] flex w-full gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[150px]">
                            <img
                                src={`/images/room decor.svg`}
                                className="w-full aspect-square object-cover rounded-lg mb-2"
                            />
                            <div className="px-2 py-4">
                                <div className="flex flex-col leading-none">
                                    <span className="text-yellow-400">★★★★★</span>
                                    <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
                                        Colorful Magical Balloon
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-[22px]">₹2999</span>
                                    <span className="text-gray-400 line-through text-sm">
                                        ₹3699
                                    </span>
                                    <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1  text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
                                        17% OFF
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* OTHER CATEGORIES */}
            <div className="w-full px-4 py-3 flex items-center justify-between mt-4">
                <p className="text-lg font-bold text-gray-700">Other categories</p>

                <div className="flex items-center gap-2 cursor-pointer">
                    <img src="/images/left-line.svg" className="w-[26px]" />
                    <img src="/images/right-line.svg" className="w-[26px]" />
                </div>
            </div>

            <div className="mt-4 overflow-x-scroll md:overflow-hidden">
                <div className="min-w-full md:min-w-[700px] *:w-[25%] flex w-full gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[150px]">
                            <img
                                src={`/images/room decor.svg`}
                                className="w-full aspect-square object-cover rounded-lg mb-2"
                            />
                            <div className="px-2 py-4">
                                <div className="flex flex-col leading-none">
                                    <span className="text-yellow-400">★★★★★</span>
                                    <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium mb-3">
                                        Colorful Magical Balloon
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-[22px]">₹2999</span>
                                    <span className="text-gray-400 line-through text-sm">
                                        ₹3699
                                    </span>
                                    <span className="border border-[#93F8C5] rounded-xl sm:rounded-2xl lg:rounded-[20px] px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white inline-flex items-center justify-center whitespace-nowrap">
                                        17% OFF
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div >
    );
}

// Image Gallery Component with Zoom
function ImageGalleryWithZoom({
    images,
    productName,
}: {
    images: string[];
    productName: string;
}) {
    const swiperRef = useRef<any>(null);
    const [active, setActive] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 50, y: 50 });

    const handleMove = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPos({ x, y });
    };

    return (
        <div className="flex flex-col items-center w-full max-w-[600px] mx-auto">
            {/* MAIN IMAGE */}
            <div className="relative w-full mx-auto px-2 sm:px-5 max-w-[90%] lg:max-w-[600px]">
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-10
                            w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow"
                        >
                            ‹
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-10
                            w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow"
                        >
                            ›
                        </button>
                    </>
                )}

                <Swiper
                    modules={[Navigation]}
                    navigation={false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => {
                        setActive(swiper.activeIndex);
                        setZoom(false);
                    }}
                    className="w-full  overflow-hidden"
                >
                    {images.map((src, i) => (
                        <SwiperSlide key={i}>
                            <div
                                className="w-full mb-5 rounded-xl
                                        overflow-hidden bg-gray-100 cursor-zoom-in"
                                onMouseEnter={() => setZoom(true)}
                                onMouseLeave={() => setZoom(false)}
                                onMouseMove={handleMove}
                            >
                                <img
                                    src={src}
                                    alt={`${productName} ${i + 1}`}
                                    className="w-full h-full object-contain"
                                    style={{
                                        transformOrigin: `${pos.x}% ${pos.y}%`,
                                        transform: zoom ? "scale(2)" : "scale(1)",
                                        transition: "transform 0.2s ease",
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* THUMBNAILS */}
            {/* <div className="hidden lg:flex gap-4 "> */}
            <div className="hidden lg:flex gap-4 overflow-x-auto flex-nowrap w-[500px]">
                {images.map((src, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setActive(i);
                            swiperRef.current?.slideTo(i, 0);
                        }}
                        className={`w-25 h-25 rounded-xl overflow-hidden cursor-pointer border
            ${active === i ? "border-red-500" : "border-gray-300"}`}
                    >
                        <img src={src} className="w-full h-full object-cover transition-none!" />
                    </div>
                ))}
            </div>

        </div >
    );
}

// Product Details Accordion Component
function ProductDetailsAccordion({
    product,
    openAccordion,
    setOpenAccordion,
}: {
    product: Product;
    openAccordion: number | null;
    setOpenAccordion: (index: number | null) => void;
}) {
    return (
        <div className="max-w-3xl mt-6">
            {/* About the Product */}
            <Accordion
                title="About the Product"
                isOpen={openAccordion === 0}
                onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
            >
                <p className="text-gray-700 text-[13px] whitespace-pre-line">{product.description}</p>
                {product.packageInclusion.length > 0 && (
                    <div className="mt-3">
                        <h4 className="font-semibold text-sm mb-2">Package Includes:</h4>
                        <ul className="list-disc ml-5 text-[13px] text-gray-700">
                            {product.packageInclusion.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Accordion>

            {/* FAQs */}
            {product.faqs.length > 0 && (
                <Accordion
                    title="FAQs"
                    isOpen={openAccordion === 1}
                    onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                >
                    <div className="space-y-3">
                        {product.faqs.map((faq, idx) => (
                            <div key={idx}>
                                <p className="font-semibold text-[13px]">{faq.question}</p>
                                <p className="text-gray-700 text-[13px] mt-1">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </Accordion>
            )}

            {/* Delivery Details */}
            {product.deliveryDetails.length > 0 && (
                <Accordion
                    title="Delivery & Shipping"
                    isOpen={openAccordion === 2}
                    onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
                >
                    <ul className="list-disc ml-5 text-[13px] text-gray-700">
                        {product.deliveryDetails.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                        ))}
                    </ul>
                </Accordion>
            )}

            {/* Care Instructions */}
            {product.careInfo.length > 0 && (
                <Accordion
                    title="Care Instructions"
                    isOpen={openAccordion === 3}
                    onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)}
                >
                    <ul className="list-disc ml-5 text-[13px] text-gray-700">
                        {product.careInfo.map((care, idx) => (
                            <li key={idx}>{care}</li>
                        ))}
                    </ul>
                </Accordion>
            )}

            {/* Variants */}
            {product.variants.length > 0 && (
                <Accordion
                    title="Available Options"
                    isOpen={openAccordion === 4}
                    onClick={() => setOpenAccordion(openAccordion === 4 ? null : 4)}
                >
                    <div className="space-y-3">
                        {product.variants.map((variant, idx) => (
                            <div key={idx}>
                                <p className="font-semibold text-[13px] mb-1">{variant.name}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {variant.options.map((option, optIdx) => (
                                        <span
                                            key={optIdx}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-[12px]"
                                        >
                                            {option}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Accordion>
            )}

            {/* Tags */}
            {product.product_tags && product.product_tags.length > 0 && (
                <div className="mt-4 p-3 border-t border-[#DBDBDB]">
                    <p className="text-[15px] font-bold mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {product.product_tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[12px]"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// function ProductDetailsAccordion({
//     product,
//     openAccordion,
//     setOpenAccordion,
// }: {
//     product: Product;
//     openAccordion: number | null;
//     setOpenAccordion: (index: number | null) => void;
// }) {
//     const tabs = [
//         "Package Inclusion",
//         "FAQs",
//         "Delivery Details",
//         "Care Info",
//         "Options",
//     ];

//     return (
//         <div className="max-w-3xl mt-6 bg-white border border-gray-200 rounded-xl">
//             {/* Tabs Header */}
//             <div className="flex gap-6 px-5 pt-4 border-b">
//                 {tabs.map((tab, index) => (
//                     <button
//                         key={index}
//                         onClick={() =>
//                             setOpenAccordion(openAccordion === index ? null : index)
//                         }
//                         className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition ${openAccordion === index
//                             ? "text-[var(--pinkd)]"
//                             : "text-gray-600 hover:text-gray-900"
//                             }`}
//                     >
//                         {tab}

//                         {openAccordion === index && (
//                             <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[var(--pinkd)] rounded-full" />
//                         )}
//                     </button>
//                 ))}
//             </div>

//             {/* Content */}
//             <div className="p-5 text-[13px] text-gray-700">
//                 {openAccordion === 0 && (
//                     <>
//                         <p className="whitespace-pre-line">
//                             {product.description}
//                         </p>

//                         {product.packageInclusion.length > 0 && (
//                             <ul className="list-disc ml-5 mt-3 space-y-1">
//                                 {product.packageInclusion.map((item, idx) => (
//                                     <li key={idx}>{item}</li>
//                                 ))}
//                             </ul>
//                         )}
//                     </>
//                 )}

//                 {openAccordion === 1 && product.faqs.length > 0 && (
//                     <div className="space-y-4">
//                         {product.faqs.map((faq, idx) => (
//                             <div key={idx}>
//                                 <p className="font-semibold">{faq.question}</p>
//                                 <p className="mt-1">{faq.answer}</p>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {openAccordion === 2 && product.deliveryDetails.length > 0 && (
//                     <ul className="list-disc ml-5 space-y-1">
//                         {product.deliveryDetails.map((detail, idx) => (
//                             <li key={idx}>{detail}</li>
//                         ))}
//                     </ul>
//                 )}

//                 {openAccordion === 3 && product.careInfo.length > 0 && (
//                     <ul className="list-disc ml-5 space-y-1">
//                         {product.careInfo.map((care, idx) => (
//                             <li key={idx}>{care}</li>
//                         ))}
//                     </ul>
//                 )}

//                 {openAccordion === 4 && product.variants.length > 0 && (
//                     <div className="space-y-4">
//                         {product.variants.map((variant, idx) => (
//                             <div key={idx}>
//                                 <p className="font-semibold mb-1">
//                                     {variant.name}:
//                                 </p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {variant.options.map((option, optIdx) => (
//                                         <span
//                                             key={optIdx}
//                                             className="px-3 py-1 bg-gray-100 rounded-full text-[12px]"
//                                         >
//                                             {option}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {product.product_tags?.length > 0 && (
//                     <div className="">
//                         <p className="text-[15px] font-bold mb-2 mt-3">Tags:</p>
//                         <div className="flex flex-wrap gap-2">
//                             {product.product_tags.map((tag, idx) => (
//                                 <span
//                                     key={idx}
//                                     className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[12px]"
//                                 >
//                                     #{tag}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//             </div>


//         </div>
//     );
// }





// Accordion Component
interface AccordionProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

function Accordion({ title, children, isOpen, onClick }: AccordionProps) {
    return (
        <div className="p-3 border-b border-[#DBDBDB]">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-lg font-medium"
            >
                <span className="text-[15px] font-bold">{title}</span>
                <span className="text-xl">{isOpen ? "-" : "+"}</span>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] mt-2" : "max-h-0 mt-0"
                    }`}
            >
                <div
                    className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

