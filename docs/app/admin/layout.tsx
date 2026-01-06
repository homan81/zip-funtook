'use client'

import { useEffect, useState, useEffectEvent } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  UserRound,
  NotebookPen,
  Boxes,
  MapPin,
  Folders,
  FolderTree,
  Images,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Dot
} from "lucide-react";
import Image from 'next/image';
//import Header from '@/app/components/admin/components/Header/Header';
//import Header from '@/app/components/admin/components/Header/Header';
import AdminHeader from '@/app/components/admin/components/AdminHeader/AdminHeader';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isactive, setIsActive] = useState(false)

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }

  const handleAuthCheck = useEffectEvent(() => {
    const token = localStorage.getItem('isAdmin')
    const isLoginRoute = pathname?.startsWith('/admin/login')

    if (token) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      // Only redirect when trying to view protected admin pages
      if (!isLoginRoute) {
        router.push('/admin/login')
      }
    }

    setLoading(false)
  })

  useEffect(() => {
    handleAuthCheck()
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('loginTime')
    setIsAdmin(false)
    router.push('/admin/login')
  }

  if (loading) return <div className="min-h-[80vh]">Loading...</div>

  // Public admin routes (login, etc.) should not render the sidebar
  if (pathname?.startsWith('/admin/login')) return <>{children}</>

  const menuIconActive = "text-white";
  const menuIconDefault = "text-[#FC6E88]";

  return (
    <div className="min-h-screen flex bg-[#f3f7fa]">
    

      {/* SIDEBAR */}
      {isAdmin && (
        <aside className="w-64 bg-[#1f1f28] text-white shadow-xl py-6 px-5 hidden md:flex flex-col h-screen sticky top-0 overflow-auto">

        {/* PROFILE */}
        <div className="flex items-center flex-col mb-10 bg-white rounded-xl">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={30}
            className="w-30 h-10 border"
          />
          <p className="text-md text-gray-600 text-left">Administrator</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col space-y-2 text-sm">

          {/* Dashboard */}
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition group
              ${pathname === "/admin/dashboard" ? "bg-[#FC6E88] text-white" : "hover:bg-[#FC6E88]/70"}`
            }
          >
            <LayoutDashboard className={`w-5 h-5 group-hover:text-white ${pathname === "/admin/dashboard" ? menuIconActive : menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Dashboard</span>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition group
              ${pathname === "/admin/users" ? "bg-[#FC6E88] text-white" : "hover:bg-[#FC6E88]/70"}`
            }
          >
            <UserRound className={`w-5 h-5 group-hover:text-white ${pathname === "/admin/users" ? menuIconActive : menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Users</span>
          </Link>

          {/* orders */}
          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition group
              ${pathname === "/admin/users" ? "bg-[#FC6E88] text-white" : "hover:bg-[#FC6E88]/70"}`
            }
          >
            <UserRound className={`w-5 h-5 group-hover:text-white ${pathname === "/admin/orders" ? menuIconActive : menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Orders</span>
          </Link>


          {/* coupons */}
          <Link
            href="/admin/coupons"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition group
              ${pathname === "/admin/coupons" ? "bg-[#FC6E88] text-white" : "hover:bg-[#FC6E88]/70"}`
            }
          >
            <UserRound className={`w-5 h-5 group-hover:text-white ${pathname === "/admin/coupons" ? menuIconActive : menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Coupons</span>
          </Link>

          {/* BLOGS */}
          <div>
            <button
              onClick={() => toggleMenu("blogs")}
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition hover:bg-[#FC6E88]/70 group"
            >
              <div className="flex items-center gap-3">
                <NotebookPen className={`w-5 h-5 group-hover:text-white ${menuIconDefault}`} />
                <span className="text-[15px] group-hover:text-white">Blogs</span>
              </div>

              {openMenu === "blogs"
                ? <ChevronDown className="w-4 h-4 text-[#FC6E88]" />
                : <ChevronRight className="w-4 h-4 text-white" />
              }
            </button>

            {/* Submenu */}
            <div
              className={`ml-10 flex flex-col overflow-hidden transition-all duration-300 
                ${openMenu === "blogs" ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`
              }
            >
              <Link href="/admin/blogs/new" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> Add Blog
              </Link>

              <Link href="/admin/blogs" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> All Blogs
              </Link>
            </div>
          </div>

          {/* PRODUCTS */}
          <div>
            <button
              onClick={() => toggleMenu("products")}
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition hover:bg-[#FC6E88]/70 group"
            >
              <div className="flex items-center gap-3">
                <Boxes className={`w-5 h-5 group-hover:text-white ${menuIconDefault}`} />
                <span className="text-[15px] group-hover:text-white">Products</span>
              </div>

              {openMenu === "products"
                ? <ChevronDown className="w-4 h-4 text-[#FC6E88]" />
                : <ChevronRight className="w-4 h-4 text-white" />
              }
            </button>

            <div
              className={`ml-10 flex flex-col overflow-hidden transition-all duration-300 
                ${openMenu === "products" ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`
              }
            >
              <Link href="/admin/products/new" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> Add Product
              </Link>

              <Link href="/admin/products" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> All Products
              </Link>
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <button
              onClick={() => toggleMenu("location")}
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition hover:bg-[#FC6E88]/70 group"
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 group-hover:text-white ${menuIconDefault}`} />
                <span className="text-[15px] group-hover:text-white">Location</span>
              </div>

              {openMenu === "location"
                ? <ChevronDown className="w-4 h-4 text-[#FC6E88]" />
                : <ChevronRight className="w-4 h-4 text-white" />
              }
            </button>

            <div
              className={`ml-10 flex flex-col overflow-hidden transition-all duration-300 
                ${openMenu === "location" ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}`
              }
            >
              <Link href="/admin/location" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> All Locations
              </Link>
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <button
              onClick={() => toggleMenu("categories")}
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition hover:bg-[#FC6E88]/70 group"
            >
              <div className="flex items-center gap-3">
                <Folders className={`w-5 h-5 group-hover:text-white ${menuIconDefault}`} />
                <span className='text-[15px] group-hover:text-white'>Categories</span>
              </div>

              {openMenu === "categories"
                ? <ChevronDown className="w-4 h-4 text-[#FC6E88]" />
                : <ChevronRight className="w-4 h-4 text-white" />
              }
            </button>

            <div
              className={`ml-10 flex flex-col overflow-hidden transition-all duration-300 
                ${openMenu === "categories" ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}`
              }
            >
              <Link href="/admin/categories" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> All Categories
              </Link>
            </div>
          </div>

          {/* SUBCATEGORY */}
          <div>
            <button
              onClick={() => toggleMenu("subcategories")}
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition hover:bg-[#FC6E88]/70 group"
            >
              <div className="flex items-center gap-3">
                <FolderTree className={`w-5 h-5 group-hover:text-white ${menuIconDefault}`} />
                <span className="text-[15px] group-hover:text-white">Subcategories</span>
              </div>

              {openMenu === "subcategories"
                ? <ChevronDown className="w-4 h-4 text-[#FC6E88]" />
                : <ChevronRight className="w-4 h-4 text-white" />
              }
            </button>

            <div
              className={`ml-10 flex flex-col overflow-hidden transition-all duration-300 
                ${openMenu === "subcategories" ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}`
              }
            >
              <Link href="/admin/subcategories" className="flex items-center gap-2 py-1 hover:text-[#FC6E88]">
                <Dot className={`${menuIconDefault}`} /> All Subcategories
              </Link>
            </div>
          </div>

          {/* MEDIA */}
          <Link
            href="/admin/media/server"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition group
            ${pathname === "/admin/media/server" ? "bg-[#FC6E88] text-white" : "hover:bg-[#FC6E88]/70"}`}
          >
            <Images className={`w-5 h-5 group-hover:text-white ${pathname === "/admin/media/server" ? menuIconActive : menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Media Library</span>
          </Link>

          {/* SETTINGS */}
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition group
            ${pathname === "/admin/settings" ? "bg-[#FC6E88] text-white" : "hover:bg-[#FC6E88]/70"}`}
          >
            <Settings className={`w-5 h-5 group-hover:text-white ${pathname === "/admin/settings" ? menuIconActive : menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Settings</span>
          </Link>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl transition hover:bg-[#FC6E88]/70 group mt-4"
          >
            <LogOut className={`w-5 h-5 group-hover:text-white ${menuIconDefault}`} />
            <span className="text-[15px] group-hover:text-white">Logout</span>
          </button>

        </nav>

        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-20 bg-transparent">
          <AdminHeader />
        </div>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
