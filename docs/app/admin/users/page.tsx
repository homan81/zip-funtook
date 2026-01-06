'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Edit, Trash, Search, Filter, MoreVertical, Eye, Download, ChevronDown, X, CheckCircle, XCircle, Mail, Phone, Calendar } from 'lucide-react'

type User = {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'User' | 'Viewer'
  status: 'Active' | 'Inactive' | 'Pending'
  lastActive: string
  joinDate: string
  avatar?: string
}

const initialUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastActive: '2024-01-15', joinDate: '2023-05-10' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Inactive', lastActive: '2024-01-10', joinDate: '2023-07-22' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Editor', status: 'Active', lastActive: '2024-01-16', joinDate: '2023-09-15' },
  { id: 4, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'Viewer', status: 'Pending', lastActive: '2024-01-14', joinDate: '2024-01-05' },
  { id: 5, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'User', status: 'Active', lastActive: '2024-01-16', joinDate: '2023-11-30' },
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('All')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [showModal, setShowModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0
  })

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User' as User['role'],
    status: 'Active' as User['status'],
    lastActive: new Date().toISOString().split('T')[0],
    joinDate: new Date().toISOString().split('T')[0]
  })
  const [newUserPassword, setNewUserPassword] = useState('')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    calculateStats()
  }, [users])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.users)) {
          const mapped = data.users.map((u: any) => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            role: u.role || 'User',
            status: u.status || 'Active',
            lastActive: u.lastActive || (u.created_at || ''),
            joinDate: u.joinDate || (u.created_at || '')
          }))
          setUsers(mapped)
        }
      }
    } catch (err) {
      // keep fallback
    } finally {
      setLoadingUsers(false)
    }
  }

  const calculateStats = () => {
    const total = users.length
    const active = users.filter(user => user.status === 'Active').length
    const inactive = users.filter(user => user.status === 'Inactive').length
    const pending = users.filter(user => user.status === 'Pending').length
    
    setStats({ total, active, inactive, pending })
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'All' || user.role === filterRole
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill all required fields')
      return
    }
    const payload = { name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status, password: newUserPassword }
    if (editingUserId) {
      // update existing user
      fetch(`/api/admin/users/${editingUserId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json()
            if (data && data.success && data.user) {
              setUsers(prev => prev.map(u => u.id === editingUserId ? { ...u, name: data.user.name || u.name, email: data.user.email || u.email, role: data.user.role || u.role, status: data.user.status || u.status } : u))
            } else {
              fetchUsers()
            }
          }
        }).catch(() => fetchUsers()).finally(() => {
          setEditingUserId(null)
          setNewUser({ name: '', email: '', role: 'User', status: 'Active', lastActive: new Date().toISOString().split('T')[0], joinDate: new Date().toISOString().split('T')[0] })
          setNewUserPassword('')
          setShowModal(false)
        })
    } else {
      // create new user
      fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(async (res) => {
          if (res.ok) {
            try {
              const data = await res.json()
              if (data && data.success && data.user) {
                const u = data.user
                setUsers(prev => [...prev, { id: u.id, name: u.name || u.email, email: u.email, role: u.role || 'User', status: u.status || 'Active', lastActive: u.created_at || '', joinDate: u.created_at || '' }])
                if (data.user.password) alert('User created. Temporary password: ' + data.user.password)
              } else {
                fetchUsers()
              }
            } catch {
              fetchUsers()
            }
          } else {
            // fallback local
            const newUserWithId = { ...newUser, id: users.length + 1 }
            setUsers(prev => [...prev, newUserWithId])
          }
        }).catch(async () => {
          const newUserWithId = { ...newUser, id: users.length + 1 }
          setUsers(prev => [...prev, newUserWithId])
        }).finally(() => {
          setNewUser({ name: '', email: '', role: 'User', status: 'Active', lastActive: new Date().toISOString().split('T')[0], joinDate: new Date().toISOString().split('T')[0] })
          setNewUserPassword('')
          setShowModal(false)
        })
    }
  }

  const handleEditUser = (id: number) => {
    const user = users.find(u => u.id === id)
    if (user) {
      setNewUser({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastActive: user.lastActive,
        joinDate: user.joinDate
      })
      setShowModal(true)
      setEditingUserId(id)
    }
  }

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (!userToDelete) return
    fetch(`/api/admin/users/${userToDelete}`, { method: 'DELETE' })
      .then(async (res) => {
        if (res.ok) {
          setUsers(prev => prev.filter(u => u.id !== userToDelete))
        } else {
          // attempt to refresh
          await fetchUsers()
        }
      }).catch(async () => { await fetchUsers() }).finally(() => {
        setShowDeleteConfirm(false)
        setUserToDelete(null)
      })
  }

  const viewUserDetails = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Last Active', 'Join Date']
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => 
        [user.name, user.email, user.role, user.status, user.lastActive, user.joinDate].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_export.csv'
    a.click()
  }

  const getStatusColor = (status: User['status']) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: User['role']) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-800'
      case 'Editor': return 'bg-blue-100 text-blue-800'
      case 'User': return 'bg-gray-100 text-gray-800'
      case 'Viewer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-2">Manage your team members and their account permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#FC6E88] to-[#FF8C69] text-white rounded-lg hover:opacity-90 transition-all shadow-md"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.inactive}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Advanced Filters</h4>
              <button
                onClick={() => setShowFilter(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="User">User</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Last Active</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Join Date</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingUsers ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-600">Loading users...</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#FC6E88] to-[#FF8C69] rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'Active' && <CheckCircle className="w-4 h-4 mr-1" />}
                        {user.status === 'Inactive' && <XCircle className="w-4 h-4 mr-1" />}
                        {user.status === 'Pending' && <Calendar className="w-4 h-4 mr-1" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.lastActive}</td>
                    <td className="py-4 px-6 text-gray-600">{user.joinDate}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* User Count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password (optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                    placeholder="Temporary password (optional)"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User['status'] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-transparent outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-gradient-to-r from-[#FC6E88] to-[#FF8C69] text-white py-3 rounded-lg hover:opacity-90 transition-all font-medium"
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FC6E88] to-[#FF8C69] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {selectedUser.name.charAt(0)}
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 text-gray-600">Role</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-600">Status</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-600">Last Active</div>
                  <div className="text-gray-900">{selectedUser.lastActive}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-600">Join Date</div>
                  <div className="text-gray-900">{selectedUser.joinDate}</div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => {
                    handleEditUser(selectedUser.id)
                    setShowUserDetails(false)
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Edit User
                </button>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setUserToDelete(null)
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}