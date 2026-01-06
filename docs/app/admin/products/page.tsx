"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function ProductListPage() {

//   const [deleteId, setDeleteId] = useState<number | null>(null);
// const [deleting, setDeleting] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);
const [deleting, setDeleting] = useState(false);

  // View modal state
  const [viewProductId, setViewProductId] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<any | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [sort, setSort] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

 // state


// delete function
const deleteProduct = async () => {
  if (deleteId === null) return;
    console.log("CALLING API WITH ID:", deleteId);

  setDeleting(true);

  try {
    const res = await fetch(`/api/products/${deleteId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    if (res.ok && json.success) {
      // remove locally
      setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(deleteId)));
      // optional: toast success
    } else {
      // show server message or generic
      alert(json?.message || "Failed to delete product");
    }
  } catch (err) {
    console.error("Frontend delete error:", err);
    alert("Network error while deleting product");
  } finally {
    setDeleting(false);
    setDeleteId(null);
  }
};

// when opening modal (example)
const openDeleteModal = (id: number) => {
  setDeleteId(id); // id must be a number
};

// View product modal functions
const openViewModal = async (id: number) => {
  setViewProductId(id);
  setLoadingProduct(true);
  try {
    const res = await fetch(`/api/products/${id}`);
    const json = await res.json();
    if (res.ok && json.success && json.product) {
      setViewProduct(json.product);
    } else {
      alert('Failed to load product details');
      setViewProductId(null);
    }
  } catch (err) {
    console.error('Error loading product:', err);
    alert('Error loading product details');
    setViewProductId(null);
  } finally {
    setLoadingProduct(false);
  }
};

const closeViewModal = () => {
  setViewProductId(null);
  setViewProduct(null);
};

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);

    const url = `/api/products?page=${page}&limit=${limit}&search=${search}&category=${category}&subcategory=${subcategory}&sort=${sort}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
      setTotalPages(data.totalPages);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, subcategory, sort]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="p-8">

      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-gray-500">Home / Products</div>
        <h1 className="text-3xl font-semibold mt-1 text-gray-800">Products</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border-gray-200 border mb-6">
        <h2 className="font-semibold mb-4 text-gray-700">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <div>
            <input
              type="text"
              placeholder="Search name..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Category"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Subcategory"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md  border-gray-200 border border-gray-200-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-gray-200 border border-gray-200-gray-200 text-gray-600">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-8">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p, index) => (
                <tr key={p.id} className="border border-gray-200 border-gray-200-gray-200 hover:bg-gray-50 transition">
                  <td className="p-3">{index + 1 + (page - 1) * limit}</td>

                  <td className="p-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                      {/* <Image
                        src={
                          p.productImage
                            ? `${BASE_URL}${p.productImage}`
                            : "/placeholder.png"
                        }
                        width={60}
                        height={60}
                        alt={p.productName}
                        className="object-cover"
                      /> */}
{/* 
                      <Image
  src={`${BASE_URL}${p.productImage}`}
  width={60}
  height={60}
  alt={p.productName}
  className="object-cover rounded-lg"
/> */}
<Image
  src={`${p.productImage}`}
  height={60}
  width={60}
  
  alt={p.productName}
  className="object-cover"
/>
                    </div>
                  </td>

                  <td className="p-3 font-medium text-gray-700">{p.productName}</td>

                  <td className="p-3 text-gray-600">{p.category}</td>

                  <td className="p-3">
                    <span className="text-green-600 font-semibold text-sm">
                      ₹{p.sellingPrice}
                    </span>
                    <span className="ml-2 line-through text-gray-400 text-xs">
                      ₹{p.mrp}
                    </span>
                  </td>

                  <td className="p-3">{p.stockQuantity}</td>

                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openViewModal(Number(p.id))}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      View
                    </button>

                    <Link
                      href={`/admin/products/edit/${p.id}`}
                      className="text-yellow-500 hover:text-yellow-600 font-medium"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => openDeleteModal(Number(p.id))}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600 text-sm">
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete?
            </h2>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={deleteProduct}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewProductId !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4  border-gray-200  border-gray-200-gray-200 border border-gray-200-gray-200 bg-linear-to-r from-[#fbeee6] to-[#fff7f2]">
              <h2 className="text-xl font-bold text-[#FC6E88]">
                Product Details
              </h2>
              <button
                type="button"
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {loadingProduct ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-600">Loading product details...</div>
                </div>
              ) : viewProduct ? (
                <div className="space-y-6">
                  {/* Product Name & Slug */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Product Name</h3>
                    <p className="text-lg font-semibold text-gray-900">{viewProduct.productName || 'N/A'}</p>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 mt-2">Slug</h3>
                    <p className="text-sm text-gray-600">{viewProduct.slug || 'N/A'}</p>
                  </div>

                  {/* Description */}
                  {viewProduct.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Description</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewProduct.description}</p>
                    </div>
                  )}

                  {/* Category & Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Category</h3>
                      <p className="text-sm text-gray-700">{viewProduct.category || 'N/A'}</p>
                      {viewProduct.subcategory && (
                        <>
                          <h3 className="text-sm font-semibold text-gray-500 mb-1 mt-2">Subcategory</h3>
                          <p className="text-sm text-gray-700">{viewProduct.subcategory}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Location Availability</h3>
                      {viewProduct.locationAvailability && Array.isArray(viewProduct.locationAvailability) && viewProduct.locationAvailability.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {viewProduct.locationAvailability.map((loc: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {loc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Not set</p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {viewProduct.product_tags && Array.isArray(viewProduct.product_tags) && viewProduct.product_tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Product Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {viewProduct.product_tags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Image */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Product Image</h3>
                    {viewProduct.productImage ? (
                      <div className="relative w-48 h-48  border-gray-200 border border-gray-200-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={`${BASE_URL}${viewProduct.productImage}`}
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No image</p>
                    )}
                  </div>

                  {/* Gallery Images */}
                  {viewProduct.gallery && Array.isArray(viewProduct.gallery) && viewProduct.gallery.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Gallery Images</h3>
                      <div className="flex flex-wrap gap-2">
                        {viewProduct.gallery.map((img: any, idx: number) => (
                          <div key={idx} className="relative w-24 h-24  border-gray-200 border border-gray-200-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={`${BASE_URL}${img.image || img}`}
                              alt={`Gallery ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variants */}
                  {viewProduct.variants && Array.isArray(viewProduct.variants) && viewProduct.variants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Variants</h3>
                      <div className="space-y-3">
                        {viewProduct.variants.map((variant: any, vIdx: number) => (
                          <div key={vIdx} className="border border-gray-200  border-gray-200-gray-200 rounded-lg p-3 bg-gray-50">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              {variant.name || `Variant ${vIdx + 1}`}
                            </p>
                            {variant.options && Array.isArray(variant.options) && variant.options.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {variant.options.map((opt: string, oIdx: number) => (
                                  opt && (
                                    <span key={oIdx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                      {opt}
                                    </span>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-4 border border-gray-200 pt-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">MRP</h3>
                      <p className="text-lg font-bold text-gray-900">₹{viewProduct.price || viewProduct.mrp || 0}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Selling Price</h3>
                      <p className="text-lg font-bold text-green-600">₹{viewProduct.sellingPrice || 0}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Discount</h3>
                      <p className="text-lg font-bold text-red-600">{viewProduct.discountPercent || 0}%</p>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="grid grid-cols-3 gap-4 border border-gray-200 pt-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Quantity</h3>
                      <p className="text-sm text-gray-700">{viewProduct.quantity || 0} {viewProduct.unit || ''}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Stock Quantity</h3>
                      <p className="text-sm text-gray-700">{viewProduct.stockQuantity || 0}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Unit</h3>
                      <p className="text-sm text-gray-700">{viewProduct.unit || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Package Inclusion */}
                  {viewProduct.packageInclusion && Array.isArray(viewProduct.packageInclusion) && viewProduct.packageInclusion.length > 0 && (
                    <div className="border border-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Package Inclusion</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {viewProduct.packageInclusion.map((item: string, idx: number) => (
                          item && <li key={idx} className="text-sm text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Delivery Details */}
                  {viewProduct.deliveryDetails && Array.isArray(viewProduct.deliveryDetails) && viewProduct.deliveryDetails.length > 0 && (
                    <div className="border border-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Delivery Details</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {viewProduct.deliveryDetails.map((item: string, idx: number) => (
                          item && <li key={idx} className="text-sm text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Care Info */}
                  {viewProduct.careInfo && Array.isArray(viewProduct.careInfo) && viewProduct.careInfo.length > 0 && (
                    <div className="border border-gray-200-t  border-gray-200-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Care Information</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {viewProduct.careInfo.map((item: string, idx: number) => (
                          item && <li key={idx} className="text-sm text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* FAQs */}
                  {viewProduct.faqs && Array.isArray(viewProduct.faqs) && viewProduct.faqs.length > 0 && (
                    <div className="border border-gray-200-t  border-gray-200-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">FAQs</h3>
                      <div className="space-y-3">
                        {viewProduct.faqs.map((faq: any, idx: number) => (
                          (faq.question || faq.answer) && (
                            <div key={idx} className=" border-gray-200-l-4 border border-gray-200-[#FC6E88] pl-3">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                Q: {faq.question || 'Question not set'}
                              </p>
                              <p className="text-sm text-gray-600">
                                A: {faq.answer || 'Answer not set'}
                              </p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEO / Metadata */}
                  {(viewProduct.metaTitle || viewProduct.metaKeywords || viewProduct.metaDescription || viewProduct.canonicalUrl || viewProduct.seoSchema) && (
                    <div className="border border-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">SEO / Metadata</h3>
                      {viewProduct.metaTitle && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-500">Meta Title</h4>
                          <p className="text-sm text-gray-800">{viewProduct.metaTitle}</p>
                        </div>
                      )}

                      {viewProduct.metaKeywords && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-500">Meta Keywords</h4>
                          <p className="text-sm text-gray-700">{viewProduct.metaKeywords}</p>
                        </div>
                      )}

                      {viewProduct.metaDescription && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-500">Meta Description</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewProduct.metaDescription}</p>
                        </div>
                      )}

                      {viewProduct.canonicalUrl && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-500">Canonical URL</h4>
                          <a href={viewProduct.canonicalUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">{viewProduct.canonicalUrl}</a>
                        </div>
                      )}

                      {viewProduct.seoSchema && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-500">SEO JSON-LD</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{typeof viewProduct.seoSchema === 'string' ? viewProduct.seoSchema : JSON.stringify(viewProduct.seoSchema, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="mt-4 text-right text-sm text-gray-500">
                    {viewProduct.created_at && <div>Created: {new Date(viewProduct.created_at).toLocaleString()}</div>}
                    {viewProduct.updated_at && <div>Updated: {new Date(viewProduct.updated_at).toLocaleString()}</div>}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-red-600">Failed to load product details</div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border border-gray-200-t border-gray-200-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeViewModal}
                className="px-4 py-2 border border-gray-200  border-gray-200-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {viewProductId && (
                <Link
                  href={`/admin/products/edit/${viewProductId}`}
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-[#FC6E88] text-white rounded-lg hover:bg-[#fc6e88d0] transition-colors"
                >
                  Edit Product
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
