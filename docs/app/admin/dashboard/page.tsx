'use client'

import Link from 'next/link'
import { useCart } from '@/app/contexts/CartContext'
import { ShoppingCart, Package, DollarSign, Trash2, ExternalLink, TrendingUp, Users, Tag, MapPin, BarChart3, PieChart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export default function AdminDashboard() {
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, paid: 0 })
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalCoupons: 0,
    totalLocations: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, subcategoriesRes, couponsRes, locationsRes] = await Promise.all([
        fetch('/api/products?limit=1'),
        fetch('/api/categories'),
        fetch('/api/subcategories'),
        fetch('/api/admin/coupons'),
        fetch('/api/location')
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const subcategoriesData = await subcategoriesRes.json()
      const couponsData = await couponsRes.json()
      const locationsData = await locationsRes.json()

      // Calculate total revenue and profit from orders
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const totalProfit = totalRevenue * 0.35 // Assuming 35% profit margin

      setStats({
        totalProducts: productsData.total || 0,
        totalCategories: Array.isArray(categoriesData.categories) ? categoriesData.categories.length : 0,
        totalSubcategories: Array.isArray(subcategoriesData.subcategories) ? subcategoriesData.subcategories.length : 0,
        totalCoupons: Array.isArray(couponsData.coupons) ? couponsData.coupons.length : 0,
        totalLocations: Array.isArray(locationsData.locations) ? locationsData.locations.length : 0,
        totalOrders: orderStats.total,
        totalRevenue: Math.round(totalRevenue),
        totalProfit: Math.round(totalProfit)
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=5')
      const json = await res.json()
      if (res.ok && json.success) {
        setProducts(json.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders/stats')
      const json = await res.json()
      if (res.ok && json.success) {
        setOrders(json.recentOrders || [])
        setOrderStats(json.stats || { total: 0, pending: 0, paid: 0 })
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-4 md:px-6 lg:px-8 py-8">
        {/* Page Header
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div> */}

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Customers */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{stats.totalProducts * 2}</p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
            <p className="text-xs text-green-600 font-medium">↑ Active users</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">₹{(stats.totalRevenue / 1000).toFixed(1)}k</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
            <p className="text-xs text-blue-600 font-medium">↑ Revenue growth</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{orderStats.total}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
            <p className="text-xs text-orange-600 font-medium">{orderStats.pending} pending</p>
          </div>

          {/* Total Profit */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Profit</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">₹{(stats.totalProfit / 1000).toFixed(1)}k</p>
              </div>
              <TrendingUp className="w-12 h-12 text-pink-500 opacity-20" />
            </div>
            <p className="text-xs text-pink-600 font-medium">35% margin</p>
          </div>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Left Column - Inventory Management */}
          <div className="space-y-6">
            
            {/* Inventory Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Inventory Management</h2>
              <div className="grid grid-cols-2 gap-4">
                
                <Link href="/admin/products" className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow transition border-l-4 border-green-500">
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalProducts}</p>
                  <p className="text-xs text-green-700 mt-2 hover:underline">View Products →</p>
                </Link>

                <Link href="/admin/categories" className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow transition border-l-4 border-purple-500">
                  <p className="text-gray-600 text-sm">Total Categories</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalCategories}</p>
                  <p className="text-xs text-purple-700 mt-2 hover:underline">Manage →</p>
                </Link>

                <Link href="/admin/subcategories" className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow transition border-l-4 border-yellow-500">
                  <p className="text-gray-600 text-sm">Subcategories</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.totalSubcategories}</p>
                  <p className="text-xs text-yellow-700 mt-2 hover:underline">Manage →</p>
                </Link>

                <Link href="/admin/location" className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow transition border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm">Total Locations</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalLocations}</p>
                  <p className="text-xs text-blue-700 mt-2 hover:underline">Manage →</p>
                </Link>

              </div>
            </div>

            {/* Orders Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Orders Breakdown</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 text-sm mb-2">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-yellow-700 text-sm mb-2">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-green-700 text-sm mb-2">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.paid}</p>
                </div>
              </div>
              <Link href="/admin/orders" className="mt-4 block text-center text-orange-600 hover:text-orange-700 font-medium text-sm">
                View All Orders →
              </Link>
            </div>

          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            
            {/* Promotions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Promotions</h2>
              <Link href="/admin/coupons" className="w-full p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg hover:shadow transition border-l-4 border-pink-500">
                <p className="text-gray-600 text-sm">Active Coupons</p>
                <p className="text-3xl font-bold text-pink-600 mt-1">{stats.totalCoupons}</p>
                <p className="text-xs text-pink-700 mt-2 hover:underline">Manage Coupons →</p>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/admin/products/new" className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm">
                  <Package className="w-5 h-5" />
                  Add New Product
                </Link>
                <Link href="/admin/orders" className="w-full flex items-center gap-3 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition font-medium text-sm">
                  <ShoppingCart className="w-5 h-5" />
                  View Orders
                </Link>
                <Link href="/admin/coupons" className="w-full flex items-center gap-3 p-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition font-medium text-sm">
                  <Tag className="w-5 h-5" />
                  Create Coupon
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section - Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-medium">↑ 12% growth</p>
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded text-center">
                  <p className="text-gray-600 text-xs mb-1">Avg Order Value</p>
                  <p className="text-lg font-bold text-gray-900">₹{orderStats.total > 0 ? Math.round(stats.totalRevenue / orderStats.total) : 0}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded text-center">
                  <p className="text-gray-600 text-xs mb-1">Total Profit</p>
                  <p className="text-lg font-bold text-pink-600">₹{stats.totalProfit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">System Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">Total Products</span>
                <span className="text-xl font-bold text-green-600">{stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">Categories</span>
                <span className="text-xl font-bold text-purple-600">{stats.totalCategories}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">Active Orders</span>
                <span className="text-xl font-bold text-orange-600">{orderStats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">Active Coupons</span>
                <span className="text-xl font-bold text-pink-600">{stats.totalCoupons}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Analytics Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="relative h-64">
                <Line
                  data={{
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [
                      {
                        label: 'Revenue (₹)',
                        data: [12000, 15000, 13500, 18000, 21000, stats.totalRevenue],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: 'top' }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
                <PieChart className="w-5 h-5 text-purple-500" />
              </div>
              <div className="relative h-64">
                <Pie
                  data={{
                    labels: ['Pending', 'Completed', 'Cancelled'],
                    datasets: [
                      {
                        data: [orderStats.pending, orderStats.paid, Math.max(0, orderStats.total - orderStats.pending - orderStats.paid)],
                        backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
                        borderColor: ['#f59e0b', '#059669', '#dc2626'],
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: 'bottom' }
                    }
                  }}
                />
              </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Monthly Sales</h3>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div className="relative h-64">
                <Bar
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Sales (Orders)',
                        data: [8, 12, 15, 10, 18, 22, 19, 25, 28, 32, orderStats.total, stats.totalProducts],
                        backgroundColor: '#10b981',
                        borderColor: '#059669',
                        borderWidth: 1,
                        borderRadius: 5
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Category Performance</h3>
              <div className="space-y-4">
                {[
                  { name: 'Electronics', value: 45, percentage: 45 },
                  { name: 'Fashion', value: 30, percentage: 30 },
                  { name: 'Home & Garden', value: 15, percentage: 15 },
                  { name: 'Sports', value: 10, percentage: 10 }
                ].map((category, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 font-medium">{category.name}</span>
                      <span className="text-gray-600 text-sm">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold text-blue-600">3.45%</p>
              <p className="text-xs text-blue-500 mt-2">↑ 0.5% from last month</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Avg Order Value</p>
              <p className="text-3xl font-bold text-green-600">₹{orderStats.total > 0 ? Math.round(stats.totalRevenue / orderStats.total) : 0}</p>
              <p className="text-xs text-green-500 mt-2">↑ ₹500 increase</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Customer Retention</p>
              <p className="text-3xl font-bold text-purple-600">78%</p>
              <p className="text-xs text-purple-500 mt-2">↑ 5% improvement</p>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Repeat Orders</p>
              <p className="text-3xl font-bold text-pink-600">42%</p>
              <p className="text-xs text-pink-500 mt-2">↑ 8% growth</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
