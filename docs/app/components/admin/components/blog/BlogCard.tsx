import Link from 'next/link'
import Image from 'next/image'


interface Blog {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  image: string
}
interface BlogCardProps {
  blog: Blog
}
export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="bg-white shadow-sm  rounded-md overflow-hidden mb-6">
      <Image
        src={blog.image}
        alt={blog.title}
        width={800}
        height={400}
        className="w-full h-60 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-[#d2541d]">{blog.title}</h3>
        <p className="text-xs text-gray-400">{new Date(blog.date).toDateString()}</p>
        <p className="text-sm text-gray-700">{blog.excerpt}</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="text-[#d2541d] font-medium text-sm hover:underline"
        >
          Read more →
        </Link>
      </div>
    </div>
  )
}
