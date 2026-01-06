'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi'
import { FiSearch } from 'react-icons/fi'
import Image from 'next/image'
//import { stripHtml } from '@/lib/utils'

interface Blog {
  id: number
  title: string
  slug: string
  content: string
  created_at: string
  image_url?: string
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs')
        const data = await res.json()
        setBlogs(data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(prev => prev.filter(blog => blog.id !== id));
      } else {
        alert('Failed to delete blog');
      }
    } catch {
      alert('Failed to delete blog');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  function truncate(str?: string, n: number = 40) {
    if (!str) return '-';
    return str.length > n ? str.slice(0, n) + '...' : str;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all your blog content in one place</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative rounded-md shadow-sm w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#d2541d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#d2531ddb] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Get started by creating a new post'}
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/blogs/new"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  New Post
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#fbeee6] via-[#fff7f2] to-[#fbeee6] sticky top-0 z-10">
                  <th className="px-4 py-4 text-left text-xs font-extrabold text-[#d2541d] uppercase tracking-widest border-b-2 border-[#d2541d] rounded-tl-xl shadow-sm">Image</th>
                  <th className="px-4 py-4 text-left text-xs font-extrabold text-[#d2541d] uppercase tracking-widest border-b-2 border-[#d2541d] shadow-sm">Title</th>
                  <th className="px-4 py-4 text-left text-xs font-extrabold text-[#d2541d] uppercase tracking-widest border-b-2 border-[#d2541d] shadow-sm">Content</th>
                  <th className="px-4 py-4 text-left text-xs font-extrabold text-[#d2541d] uppercase tracking-widest border-b-2 border-[#d2541d] shadow-sm">Created At</th>
                  <th className="px-4 py-4 text-left text-xs font-extrabold text-[#d2541d] uppercase tracking-widest border-b-2 border-[#d2541d] rounded-tr-xl shadow-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, idx) => (
                  <tr
                    key={blog.id}
                    className={
                      'transition-shadow group ' +
                      (idx % 2 === 0
                        ? 'bg-white hover:shadow-md'
                        : 'bg-gray-50 hover:shadow-md')
                    }
                  >
                    <td className="px-4 py-3 border-b border-gray-100 rounded-l-xl align-middle">
                      {blog.image_url ? (
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                          <Image
                            src={blog.image_url}
                            alt={blog.title}
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                          <FiEye className="h-6 w-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-gray-900 font-semibold text-base max-w-[200px] truncate align-middle" title={blog.title}>{truncate(blog.title, 40)}</td>
                    {/* <td className="px-4 py-3 border-b border-gray-100 text-gray-700 max-w-[320px] truncate align-middle" title={stripHtml(blog.content)}>{truncate(stripHtml(blog.content), 60)}</td> */}
                    <td className="px-4 py-3 border-b border-gray-100 text-xs text-gray-500 align-middle" title={formatDate(blog.created_at)}>{formatDate(blog.created_at)}</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-center rounded-r-xl align-middle">
                      <div className="flex space-x-2 justify-center">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="inline-flex items-center p-2 rounded-full bg-[#fbeee6] hover:bg-[#d2541d]/10 transition"
                          title="View"
                        >
                          <FiEye className="h-5 w-5 text-[#d2541d] group-hover:text-[#a13c0e]" />
                        </Link>
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="inline-flex items-center p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5 text-blue-600 group-hover:text-blue-800" />
                        </Link>
                        <button
                          className="inline-flex items-center p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                          title="Delete"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <FiTrash2 className="h-5 w-5 text-red-500 group-hover:text-red-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBlogs.length > 0 && (
          <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredBlogs.length}</span> of{' '}
                <span className="font-medium">{blogs.length}</span> results
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-3">
              <button
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled
              >
                Previous
              </button>
              <button
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={filteredBlogs.length <= 10}
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}