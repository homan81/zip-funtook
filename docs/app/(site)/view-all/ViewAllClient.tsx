"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  productName: string;
  productImage: string | null;
  price: number;
  sellingPrice: number;
  discountPercent: number;
  stockQuantity: number;
}

export default function ViewAllClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortOption, setSortOption] = useState<string>("newest");

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

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
          {categoryFromUrl ? decodeURIComponent(categoryFromUrl) : "All Products"}
        </p>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC6E88]" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <img
                src={product.productImage || "/images/room decor.svg"}
                className="rounded-lg"
              />
              <p className="mt-2 font-medium">{product.productName}</p>
              <p>₹{product.sellingPrice}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
