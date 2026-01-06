"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrderListPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // View modal state
  const [viewOrderId, setViewOrderId] = useState<number | null>(null);
  const [viewOrder, setViewOrder] = useState<any | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calendar state
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (day: number, isStart: boolean) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatDateString(selectedDate);
    
    if (isStart) {
      setStartDate(dateString);
      setShowStartCalendar(false);
    } else {
      setEndDate(dateString);
      setShowEndCalendar(false);
    }
  };

  const renderCalendar = (isStart: boolean) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const isDisabled = day === null || new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) > today;
            return (
              <button
                key={idx}
                onClick={() => !isDisabled && day && handleDateSelect(day, isStart)}
                disabled={isDisabled}
                className={`py-2 text-sm rounded-lg transition ${
                  isDisabled
                    ? "text-gray-300 cursor-not-allowed"
                    : day && formatDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) === (isStart ? startDate : endDate)
                    ? "bg-[#FC6E88] text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700 cursor-pointer"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        sort,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });
      const url = `/api/orders?${params.toString()}`;
      const res = await fetch(url);
  
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
  
      const data = await res.json();
      console.log("Fetched data:", data);
  
      if (data.success) {
        // Normalize orders to include customerName and totalPrice and items
        const normalized = (data.orders || []).map((o: any) => {
          let customerName = '';
          try {
            const sa = typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address;
            if (sa && sa.name) customerName = sa.name;
          } catch (e) {
            // ignore parse errors
          }
          if (!customerName) {
            customerName = o.user_id ? `User ${o.user_id}` : (o.shipping_phone || 'Guest');
          }

          return {
            ...o,
            customerName,
            totalPrice: o.total_amount ?? o.totalAmount ?? o.totalPrice ?? 0,
            items: o.items || [],
          };
        });

        setOrders(normalized);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Failed to load orders from API");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, [page, search, status, sort, startDate, endDate]);

  const deleteOrder = async () => {
    if (deleteId === null) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/orders/${deleteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // remove locally
        setOrders((prev) => prev.filter((o) => Number(o.id) !== Number(deleteId)));
      } else {
        alert(json?.message || "Failed to delete order");
      }
    } catch (err) {
      console.error("Frontend delete error:", err);
      alert("Network error while deleting order");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSort("newest");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Open order view modal
  const openViewModal = async (id: number) => {
    setViewOrderId(id);
    setLoadingOrder(true);
    // Use loaded orders from state to show detail (items are included)
    try {
      const o = orders.find((x) => Number(x.id) === Number(id));
      if (o) {
        setViewOrder(o);
      } else {
        alert('Order details not found in current list.');
        setViewOrderId(null);
      }
    } catch (err) {
      console.error('Error loading order from state:', err);
      alert('Error loading order details');
      setViewOrderId(null);
    } finally {
      setLoadingOrder(false);
    }
  };

  const closeViewModal = () => {
    setViewOrderId(null);
    setViewOrder(null);
  };

  return (
    <div className="p-8">
      {/* Breadcrumb
      <div className="mb-6">
        <div className="text-sm text-gray-500">Home / Orders</div>
        <h1 className="text-3xl font-semibold mt-1 text-gray-800">Orders</h1>
      </div> */}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border-gray-200 border mb-6">
        <h2 className="font-semibold mb-4 text-gray-700">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <input
              type="text"
              placeholder="Search Order ID"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Status"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Start Date"
              readOnly
              value={startDate}
              onClick={() => {
                setShowStartCalendar(!showStartCalendar);
                setShowEndCalendar(false);
              }}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer"
            />
            {showStartCalendar && (
              <div className="absolute top-full mt-2 left-0 z-50">
                {renderCalendar(true)}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="End Date"
              readOnly
              value={endDate}
              onClick={() => {
                setShowEndCalendar(!showEndCalendar);
                setShowStartCalendar(false);
              }}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer"
            />
            {showEndCalendar && (
              <div className="absolute top-full mt-2 left-0 z-50">
                {renderCalendar(false)}
              </div>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 font-medium w-full"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md border-gray-200 border mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-gray-200 text-gray-600">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Total Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">No orders found</td>
              </tr>
            ) : (
              orders.map((o, index) => (
                <tr key={o.id} className="border border-gray-200 hover:bg-gray-50 transition">
                  <td className="p-3">{index + 1 + (page - 1) * limit}</td>
                  <td className="p-3 font-medium text-gray-700">{o.id}</td>
                  <td className="p-3 text-gray-600">{o.customerName}</td>
                  <td className="p-3">₹{Number(o.totalPrice).toFixed(2)}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openViewModal(Number(o.id))}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      View
                    </button>

                    <button
                      onClick={() => setDeleteId(Number(o.id))}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                ))
            )}  
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600 text-sm">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteOrder}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrderId !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-[#FC6E88]">Order Details</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {loadingOrder ? (
                <div className="flex items-center justify-center py-12">Loading order details...</div>
              ) : viewOrder ? (
                <div>
                  {/* Display order details here */}
                  <p className="font-medium">Order ID: {viewOrder.id}</p>
                  <p>Customer Name: {viewOrder.customerName}</p>
                  <p>Status: {viewOrder.status}</p>
                  <p>Total Price: ₹{Number(viewOrder.totalPrice).toFixed(2)}</p>

                  <div className="mt-4">
                    <h3 className="font-semibold">Shipping</h3>
                    <pre className="text-sm bg-gray-50 p-2 rounded mt-2">{typeof viewOrder.shipping_address === 'string' ? viewOrder.shipping_address : JSON.stringify(viewOrder.shipping_address, null, 2)}</pre>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold">Products</h3>
                    <ul className="mt-2 space-y-2">
                      {Array.isArray(viewOrder.items) && viewOrder.items.map((it: any) => (
                        <li key={it.id} className="border p-3 rounded flex justify-between">
                          <div>
                            <div className="font-medium">{it.product_name || it.productName || `Product ${it.product_id || it.productId}`}</div>
                            <div className="text-sm text-gray-500">Qty: {it.quantity} × ₹{Number(it.unit_price ?? it.unitPrice ?? it.price ?? 0).toFixed(2)}</div>
                          </div>
                          <div className="font-medium">₹{Number(it.total_price ?? it.totalPrice ?? (it.quantity * (it.unit_price ?? it.unitPrice ?? it.price ?? 0))).toFixed(2)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div>Failed to load order details</div>
              )}
            </div>

            <div className="px-6 py-4 border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeViewModal} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
