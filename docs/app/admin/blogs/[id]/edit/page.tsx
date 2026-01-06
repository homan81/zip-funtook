'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
//import CustomEditor from '@/app/components/blog/CustomEditor'
import CustomEditor from '@/app/components/admin/components/blog/CustomEditor'
import axios from 'axios'
import Image from 'next/image'

interface BlogForm {
  title: string
  content: string
  slug: string
  image_url?: string
  image_file?: File
}

export default function EditBlogPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [form, setForm] = useState<BlogForm>({
    title: '',
    content: '',
    slug: '',
    image_url: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      setLoading(true)
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        const blog = Array.isArray(res.data) ? res.data[0] : res.data;
        if (blog) {
          setForm(blog);
        } else {
          alert('Blog not found');
        }
      } catch {
        alert('Failed to fetch blog details');
      } finally {
        setLoading(false)
      }
    };
    fetchBlogData()
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const setText = (value: string) => {
    setForm(prev => ({ ...prev, content: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm(prev => ({
        ...prev,
        image_url: previewUrl,
        image_file: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('slug', form.slug);
    formData.append('content', form.content);
    if (form.image_file) {
      formData.append('image', form.image_file);
    } else if (form.image_url) {
      formData.append('image_url', form.image_url);
    }

    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.ok) router.push('/admin/blogs')
    else alert('Failed to update blog')
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
      router.push('/admin/blogs')
    }
  }

  return (
    <section className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className=" poppins-font text-3xl font-bold text-[#1a1a1a] poppins-font">Edit Blog</h1>
        <Link
          href="/admin/blogs"
          className="poppins-font hover:bg-[#d2531ddb] bg-[#d2531d] text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition-all duration-300"
        >
          All Blogs
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading blog details...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter Blog Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#115c8f] text-sm hind-font"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Enter Blog Slug"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#115c8f] text-sm hind-font"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Image</label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#115c8f] focus:border-[#115c8f] text-sm transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#115c8f] file:text-white hover:file:bg-[#0e466b] file:cursor-pointer"
              />
              {/* Image Preview */}
              {form.image_url && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={form.image_url}
                      alt="Blog preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CKEditor */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Content</label>
            <CustomEditor text={form.content} setText={setText} />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="hover:bg-[#d2531ddb] hind-font bg-[#d2531d] text-white font-semibold px-5 py-2 rounded-md transition-all duration-300"
            >
              Update Blog
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 hind-font text-white font-semibold px-5 py-2 rounded-md transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
