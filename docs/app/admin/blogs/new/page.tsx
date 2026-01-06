'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import CustomEditor from '@/app/components/admin/components/blog/CustomEditor'


export default function NewBlogPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    image_file: null as File | null,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const setText = (value: string) => {
    setForm(prev => ({ ...prev, content: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('slug', form.slug)
    formData.append('content', form.content)
    formData.append('meta_title', form.meta_title)
    formData.append('meta_description', form.meta_description)
    formData.append('meta_keywords', form.meta_keywords)

    if (form.image_file) {
      formData.append('image', form.image_file)
    }

    try {
      const res = await axios.post('/api/blogs', formData)
      if (res.status === 200) router.push('/admin/blogs')
    } catch {
      alert('Failed to create blog')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-4 border border-gray-200 bg-gradient-to-r from-[#fbeee6] to-[#fff7f2]">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-[#FC6E88]">
                  Add New Blog
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create and publish a new blog post
                </p>
              </div>

              <Link
                href="/admin/blogs"
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-[#FC6E88] bg-white border border-gray-200 hover:bg-gray-50"
              >
                ← Back to Blogs
              </Link>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">

            {/* BLOG INFO */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h2 className="text-sm font-semibold mb-3">Blog Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FC6E88]"
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FC6E88]"
                    placeholder="blog-title-slug"
                  />
                </div>
              </div>
            </div>

            {/* FEATURED IMAGE */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h2 className="text-sm font-semibold mb-3">
                Featured Image
              </h2>

              <input
                type="file"
                accept="image/*"
                required
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setForm(prev => ({
                      ...prev,
                      image_file: file,
                      image_url: URL.createObjectURL(file),
                    }))
                  }
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg file:bg-[#FC6E88] file:text-white file:rounded-full file:px-4 file:py-2"
              />

              {form.image_url && (
                <div className="mt-4">
                  <Image
                    src={form.image_url}
                    alt="Preview"
                    width={180}
                    height={180}
                    className="rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h2 className="text-sm font-semibold mb-3">Content</h2>
              <CustomEditor
                text={form.content}
                setText={setText}
              />
            </div>

            {/* SEO META */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h2 className="text-sm font-semibold mb-3">
                SEO Meta Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Title
                  </label>
                  <input
                    name="meta_title"
                    value={form.meta_title}
                    onChange={handleChange}
                    maxLength={60}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FC6E88]"
                    placeholder="SEO title (60 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Keywords
                  </label>
                  <input
                    name="meta_keywords"
                    value={form.meta_keywords}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FC6E88]"
                    placeholder="keyword1, keyword2"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={form.meta_description}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FC6E88]"
                  placeholder="SEO description (160 characters)"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-6 border border-gray-200">
              <button
                type="submit"
                className="w-full bg-[#FC6E88] hover:bg-[#fc6e88d0] text-white font-semibold py-3 rounded-lg"
              >
                Create Blog
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
