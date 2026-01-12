"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface Product {
    id: number;
    productName: string;
    productImage: string | null;
    price: number;
    sellingPrice: number;
    discountPercent: number;
    stockQuantity: number;
    category: string;
}

export default function ViewAllClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [sortOption, setSortOption] = useState<string>("newest");

    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const categoriesFromProducts = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
    );
    const router = useRouter();



    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: "20",
                    sortBy: sortOption,
                });

                if (categoryFromUrl) params.append("category", categoryFromUrl);

                const res = await fetch(`/api/products?${params}`);
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data?.message || "Failed to fetch");
                }

                setProducts(data.products);
                setPagination(data.pagination);
            } catch (err) {
                console.error(err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, sortOption, categoryFromUrl]);

    return (

        <div className="w-full container mx-auto px-6 py-4 md:px-4 md:py-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-5">
                <p className="text-left text-2xl md:text-3xl font-semibold">
                    {categoryFromUrl
                        ? decodeURIComponent(categoryFromUrl)
                        : "All Products"}
                </p>

                {pagination && (
                    <div className="hidden sm:flex items-center gap-4">
                        <p>{pagination.totalItems} Products</p>
                        <span>|</span>
                        <div className="flex items-center gap-1">
                            <p className="text-[#2BAC17]">★ 4.5</p>
                            <p>reviews</p>
                        </div>
                    </div>
                )}
            </div>

            <div
                className="
                    grid grid-cols-3 lg:grid-cols-6 gap-4
                    [&_p]:text-center
                    [&_p]:text-black
                    [&_p]:text-xs
                    sm:[&_p]:text-sm
                    lg:[&_p]:text-lg
                    [&_p]:mt-2
                    mb-10
                    "
            >
                {categoriesFromProducts.map((category) => {
                    const product = products.find(
                        (p) => p.category === category
                    );

                    return (
                        <div
                            key={category}
                            // onClick={() => {
                            //     if (product) {
                            //         router.push(`/product-details/${product.id}`);
                            //     }
                            // }}
                            onClick={() => {
                                router.push(`/view-all?category=${encodeURIComponent(category)}`);
                            }}

                            className="cursor-pointer"
                        >
                            {/* <div
                                className="
                                    mx-auto overflow-hidden
                                    w-full max-w-[120px]
                                    sm:max-w-[160px]
                                    lg:max-w-[230px]
                                    aspect-square
                                    hover:scale-105 transition-transform
                                    "
                            > */}
                            <div
                                className={`
    mx-auto overflow-hidden
    w-full max-w-[120px]
    sm:max-w-[160px]
    lg:max-w-[230px]
    aspect-square
    transition-transform
    ${categoryFromUrl === category}
  `}
                            >

                                <img
                                    src="/images/image3.svg"
                                    alt={category}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <p>{category}</p>
                        </div>
                    );
                })}
            </div>

            {/* Results Bar */}
            <div className="w-full bg-[#E7E7E7] rounded-lg px-3 py-2 flex items-center justify-between mb-4">
                <p className="text-xs sm:text-sm text-black">
                    Showing {products.length} of {pagination?.totalItems || 0} Results
                </p>

                <div className="flex items-center gap-2 cursor-pointer">
                    <img src="/images/sort.svg" className="w-4 sm:w-5" />
                    <span className="text-xs sm:text-sm text-black">Sort By</span>
                </div>
            </div>


            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC6E88]" />
                </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => {
                        const discount =
                            product.price > product.sellingPrice
                                ? Math.round(
                                    ((product.price - product.sellingPrice) / product.price) *
                                    100
                                )
                                : 0;

                        return (
                            <Link
                                key={product.id}
                                href={`/product-details/${product.id}`}
                                className="cursor-pointer"
                            >
                                <img
                                    src={product.productImage || "/images/room decor.svg"}
                                    className="w-full aspect-square object-cover rounded-lg mb-2"
                                />

                                <div className="px-2 py-3">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-yellow-400 text-xs">★★★★★</span>

                                        <span className="text-sm md:text-base font-medium mb-2 line-clamp-2">
                                            {product.productName}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm md:text-base">
                                            ₹{product.sellingPrice}
                                        </span>

                                        {product.price > product.sellingPrice && (
                                            <span className="text-gray-400 line-through text-xs">
                                                ₹{product.price}
                                            </span>
                                        )}

                                        {discount > 0 && (
                                            <span className="border border-[#93F8C5] rounded-xl px-2 py-0.5 text-[9px] font-medium text-[#016136] bg-linear-to-r from-[#91F8C5] to-white">
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
                    <p className="text-gray-500 text-lg">
                        No products found in this category.
                    </p>
                </div>
            )}
        </div>
    );

}
