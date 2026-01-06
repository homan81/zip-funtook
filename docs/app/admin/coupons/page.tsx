'use client'

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Coupon = {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  max_uses: number | null
  used_count: number
  min_cart_value: number | null
  expires_at: string | null
  active: number
}

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [form, setForm] = useState<any>({
    code: '',
    type: 'percent',
    value: 0,
    max_uses: '',
    min_cart_value: '',
    expires_at: '',
    active: true
  })
  const [showModal, setShowModal] = useState(false)

  // Calendar state
  const [showExpiryCalendar, setShowExpiryCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateString = formatDateString(selectedDate)
    setForm({ ...form, expires_at: dateString })
    setShowExpiryCalendar(false)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-semibold text-gray-700">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const isDisabled = day === null || new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < today
            return (
              <button
                key={idx}
                onClick={() => !isDisabled && day && handleDateSelect(day)}
                disabled={isDisabled}
                className={`py-2 text-sm rounded-lg transition ${
                  isDisabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : day && formatDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) === form.expires_at
                    ? 'bg-[#FC6E88] text-white font-semibold'
                    : 'hover:bg-gray-100 text-gray-700 cursor-pointer'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const fetchList = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/coupons')
      const j = await res.json()
      if (j.success) setCoupons(j.coupons || [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchList() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({
      code: '',
      type: 'percent',
      value: 0,
      max_uses: '',
      min_cart_value: '',
      expires_at: '',
      active: true
    })
    setShowModal(true)
  }

  const openEdit = (c: Coupon) => {
    setEditing(c)
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      max_uses: c.max_uses ?? '',
      min_cart_value: c.min_cart_value ?? '',
      expires_at: c.expires_at ?? '',
      active: !!c.active
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  const save = async () => {
    try {
      const payload: any = {
        code: String(form.code || '').trim(),
        type: form.type,
        value: Number(form.value || 0),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        min_cart_value: form.min_cart_value ? Number(form.min_cart_value) : null,
        expires_at: form.expires_at || null,
        active: form.active,
        metadata: {}
      }
      let res
      if (editing) {
        res = await fetch(`/api/admin/coupons/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      } else {
        res = await fetch('/api/admin/coupons', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      }
      const j = await res.json()
      if (!j.success) throw new Error(j.message || 'Failed')
      await fetchList()
      closeModal()
    } catch (e: any) { alert(e?.message || 'Save failed') }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete coupon?')) return
    console.log('Removing coupon', id)
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
      const j = await res.json()
      if (!j.success) throw new Error(j.message || 'Delete failed')
      await fetchList()
    } catch (e: any) { alert(e?.message || 'Delete failed') }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Coupons</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#FC6E88] text-white rounded-lg shadow-md hover:bg-[#f06d7b]">New Coupon</button>
      </div>

      {/* Modal for New/Edit Coupon */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Coupon' : 'Create Coupon'}</h2>
            <div className="space-y-4">
              <input
                placeholder="Code"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
              <input
                type="number"
                placeholder="Value"
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                placeholder="Max uses"
                value={form.max_uses}
                onChange={e => setForm({ ...form, max_uses: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                placeholder="Min cart value"
                value={form.min_cart_value}
                onChange={e => setForm({ ...form, min_cart_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Expiry Date"
                  readOnly
                  value={form.expires_at}
                  onClick={() => setShowExpiryCalendar(!showExpiryCalendar)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
                />
                {showExpiryCalendar && (
                  <div className="absolute top-full mt-2 left-0 z-50">
                    {renderCalendar()}
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="text-[#FC6E88]"
                />
                Active
              </label>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={save} className="px-4 py-2 bg-[#10B981] text-white rounded-lg">Save</button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-black rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? <div className="text-center text-lg text-gray-500">Loading...</div> : (
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500">
                <th className="py-2 px-3 border-b">Code</th>
                <th className="py-2 px-3 border-b">Type</th>
                <th className="py-2 px-3 border-b">Value</th>
                <th className="py-2 px-3 border-b">Uses</th>
                <th className="py-2 px-3 border-b">Min</th>
                <th className="py-2 px-3 border-b">Expires</th>
                <th className="py-2 px-3 border-b">Active</th>
                <th className="py-2 px-3 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 px-3">{c.code}</td>
                  <td>{c.type}</td>
                  <td>{c.value}</td>
                  <td>{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td>{c.min_cart_value ?? '-'}</td>
                  <td>{c.expires_at ? new Date(c.expires_at).toLocaleString() : '-'}</td>
                  <td>{c.active ? 'Yes' : 'No'}</td>
                  <td className="text-right">
                    <button onClick={() => openEdit(c)} className="text-[#FC6E88] mr-3">Edit</button>
                    <button onClick={() => remove(c.id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
