"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  productName: string;
  slug: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  productImage: string;
  price: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  unit: string;
  stockQuantity: number;
  gallery: string[];
}

interface SearchResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function CategoryDemoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const categoryName = "Anniversary Decoration";

  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://funtook-2.vercel.app/api/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: [categoryName],
          page: pageNum,
          limit: 12,
          sortBy: "newest",
        }),
      });

      const result: SearchResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Failed to fetch products");
      }

      setProducts(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            Browse our collection of {categoryName.toLowerCase()} products
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC6E88]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={product.productImage}
                      alt={product.productName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.discountPercent > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[48px]">
                      {product.productName}
                    </h3>

                    {product.subcategory && (
                      <p className="text-xs text-gray-500 mb-2">
                        {product.subcategory}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-[#FC6E88]">
                        ₹{product.sellingPrice}
                      </span>
                      {product.price > product.sellingPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {product.quantity} {product.unit}
                      </span>
                      <span
                        className={
                          product.stockQuantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* View Button */}
                    <button className="mt-3 w-full bg-[#FC6E88] hover:bg-[#e55d77] text-white font-semibold py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 bg-white rounded-lg shadow p-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  <span className="text-gray-500 text-sm ml-2">
                    ({pagination.totalItems} products)
                  </span>
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-[#FC6E88] hover:bg-[#e55d77] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
