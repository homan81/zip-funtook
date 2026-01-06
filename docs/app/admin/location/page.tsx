'use client';

import { useEffect, useEffectEvent, useState } from "react";

interface Location {
  id: number;
  name: string;
}

export default function LocationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");



  const loadLocations = async () => {
    setLoading(true);
    const res = await fetch("/api/location");
    const data = await res.json();
    if (data.success) setLocations(data.locations);
    setLoading(false);
  };

  const locationsfetch = useEffectEvent(() => {
    loadLocations();
  });

  useEffect(() => {
    locationsfetch();
  }, []);

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/location", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    setName("");
    await loadLocations();
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    await fetch(`/api/location/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ name: editName }),
    });

    setEditId(null);
    setEditName("");
    await loadLocations();
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;

    await fetch(`/api/location/${id}`, {
      method: "DELETE",
    });

    await loadLocations();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Locations</h1>

      {/* Add Location */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center"
      >
     <input
  type="text"
  placeholder="Location name"
  className="border border-gray-200 rounded-lg px-3 py-2 flex-1"
  value={name}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only letters and spaces
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
    }
  }}
  required
/>


        <button
          type="submit"
          className="bg-[#FC6E88] text-white px-4 py-2 rounded-lg"
        >
          Add Location
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center">Loading...</td>
              </tr>
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">No locations</td>
              </tr>
            ) : (
              locations.map((loc, idx) => (
                <tr key={loc.id} className="border border-gray-200">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{loc.name}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setEditId(loc.id);
                        setEditName(loc.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(loc.id)}
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

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-lg font-semibold">Edit Location</h2>

            <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-2 w-full"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setEditName("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#FC6E88] text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
