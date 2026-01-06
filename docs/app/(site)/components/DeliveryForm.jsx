// components/DeliveryModal.tsx
import { useState } from "react";
import { User, Mail, Smartphone, PartyPopper, MapPin, Home } from "lucide-react";


export default function DeliveryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    occasion: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can handle form submission here
  };

  if (!isOpen) return null;

  return (
    <div className=" inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center gap-1">
              <User className="w-5 h-5 text-gray-700" /> Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center gap-1">
              <Mail className="w-5 h-5 text-gray-700" /> Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center gap-1">
              <Smartphone className="w-5 h-5 text-gray-700" /> Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Occasion */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center gap-1">
              <PartyPopper className="w-5 h-5 text-gray-700" /> Occasion <span className="text-red-500">*</span>
            </label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Select Occasion</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="festival">Festival</option>
            </select>
          </div>

          {/* Address */}
          <div className="sm:col-span-2 flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-5 h-5 text-gray-700" /> Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* City */}
          <div className="sm:col-span-2 flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center gap-1">
              <Home className="w-5 h-5 text-gray-700" /> City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-fit"
              required
            />
          </div>

          {/* Save & Continue */}
          <div className="sm:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
