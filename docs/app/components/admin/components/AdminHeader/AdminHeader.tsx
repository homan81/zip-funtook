'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react'; // Import Lucide icons

export default function AdminHeader() {
  const pathname = usePathname();

  // Remove empty & admin from path
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter(seg => seg !== 'admin');

  return (
    <div className="mb-6 px-6 py-4 bg-white shadow-md rounded-lg z-10">
      {/* Page Title with Icon */}
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-semibold text-gray-800">
          {segments.length
            ? capitalize(segments[segments.length - 1])
            : 'Dashboard'}
        </h1>
        <Home className="text-xl text-gray-500" />
      </div>

      {/* Breadcrumb */}
      <nav className="mt-3 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/admin/dashboard" className="flex items-center hover:text-[#FC6E88]">
              <Home className="mr-2" size={16} />
              Home
            </Link>
          </li>

          {segments.map((segment, index) => {
            const href = `/admin/${segments.slice(0, index + 1).join('/')}`;
            const isLast = index === segments.length - 1;

            return (
              <li key={index} className="flex items-center gap-1">
                <ChevronRight className="text-gray-400" size={16} />
                {isLast ? (
                  <span className="text-gray-800 font-medium">
                    {capitalize(segment)}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-blue-600">
                    {capitalize(segment)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

function capitalize(text: string) {
  return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
