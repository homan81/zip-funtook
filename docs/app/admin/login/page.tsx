'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, LogIn } from 'lucide-react' // Using Lucide icons for a cleaner look


const SESSION_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export default function AdminLogin() {
  
  const router = useRouter()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // ✅ Redirect if already logged in and session not expired
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    const loginTime = localStorage.getItem('loginTime')

    if (isAdmin && loginTime) {
      const now = Date.now()
      const diff = now - parseInt(loginTime)

      if (diff < SESSION_DURATION) {
        router.push('/admin/dashboard')
      } else {
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('loginTime')  
      }
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      id === process.env.NEXT_PUBLIC_ADMIN_ID &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASS
    ) {
      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('loginTime', Date.now().toString()) // ⏱ store login time
      router.push('/admin/dashboard')
    } else {
      setError('Invalid ID or password')
    }
  }

  return (
    <section className="w-full min-h-screen bg-[#f3f7fa] flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
      <LogIn className="w-6 h-6 text-[#FC6E88] text-center mx-auto mb-3" />
     
        <h2 className="text-3xl font-semibold text-[#1a1a1a] mb-6 text-center">Admin Login</h2>
        
        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-[#1a1a1a] font-medium mb-2">Admin ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter Admin ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm transition duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block text-sm text-[#1a1a1a] font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm transition duration-200 ease-in-out"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FC6E88] hover:bg-[#fc6e88cc] text-white font-semibold py-3 rounded-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FC6E88]"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  )
}
