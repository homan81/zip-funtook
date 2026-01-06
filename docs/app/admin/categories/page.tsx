"use client";

import { useEffect, useState, useEffectEvent } from "react";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  seoSchema?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [formKey, setFormKey] = useState(0);

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editMetaTitle, setEditMetaTitle] = useState("");
  const [editMetaKeywords, setEditMetaKeywords] = useState("");
  const [editMetaDescription, setEditMetaDescription] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
    }
    setLoading(false);
  };

  const final = useEffectEvent(() => {
    loadCategories();
  });

  useEffect(() => {
    final();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    if (imageFile) form.append("image", imageFile);
    form.append("metaTitle", metaTitle);
    form.append("metaKeywords", metaKeywords);
    form.append("metaDescription", metaDescription);

    // Generate canonical URL
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const canonical = `${window.location.origin}/category/${slug}`;
    form.append("canonicalUrl", canonical);

    // Build JSON-LD schema for category
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: name,
      description: metaDescription || "",
      url: canonical,
    };
    form.append("seoSchema", JSON.stringify(schema));

    const res = await fetch("/api/categories", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create category");
      return;
    }

    // Success
    setName("");
    setImageFile(null);
    setMetaTitle("");
    setMetaKeywords("");
    setMetaDescription("");
    setFormKey(prev => prev + 1); // Reset file input
    await loadCategories();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    const form = new FormData();
    form.append("name", editName);
    if (editImageFile) form.append("image", editImageFile);
    form.append("metaTitle", editMetaTitle);
    form.append("metaKeywords", editMetaKeywords);
    form.append("metaDescription", editMetaDescription);

    // Generate canonical URL
    const slug = editName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const canonical = `${window.location.origin}/category/${slug}`;
    form.append("canonicalUrl", canonical);

    // Build JSON-LD schema for category
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: editName,
      description: editMetaDescription || "",
      url: canonical,
    };
    form.append("seoSchema", JSON.stringify(schema));

    await fetch(`/api/categories/${editId}`, {
      method: "PUT",
      body: form,
    });

    setEditId(null);
    setEditImageFile(null);
    setEditName("");
    setEditMetaTitle("");
    setEditMetaKeywords("");
    setEditMetaDescription("");
    await loadCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    await loadCategories();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>

      {/* Add Category */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-lg font-semibold">Add New Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Category name *"
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            key={formKey}
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="border border-gray-200 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Meta Title"
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Meta Keywords"
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
          />

          <input
            type="text"
            placeholder="Meta Description"
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-[#FC6E88] text-white px-4 py-2 rounded-lg"
        >
          Add Category
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No categories
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className="border border-gray-200">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    )}
                  </td>
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3 text-gray-500">{cat.slug}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setEditId(cat.id);
                        setEditName(cat.name);
                        setEditImageFile(null);
                        setEditMetaTitle(cat.metaTitle || "");
                        setEditMetaKeywords(cat.metaKeywords || "");
                        setEditMetaDescription(cat.metaDescription || "");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(cat.id)}
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

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold">Edit Category</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category Name *
              </label>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditImageFile(e.target.files?.[0] || null)
                }
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={editMetaTitle}
                  onChange={(e) => setEditMetaTitle(e.target.value)}
                  placeholder="SEO title for this category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={editMetaKeywords}
                  onChange={(e) => setEditMetaKeywords(e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Description
                </label>
                <textarea
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={editMetaDescription}
                  onChange={(e) => setEditMetaDescription(e.target.value)}
                  placeholder="Short description for search engines"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setEditImageFile(null);
                  setEditName("");
                  setEditMetaTitle("");
                  setEditMetaKeywords("");
                  setEditMetaDescription("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#FC6E88] text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
