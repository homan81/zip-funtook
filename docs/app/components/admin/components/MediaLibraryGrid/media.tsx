"use client";

import { useEffect, useState } from "react";

export default function MediaLibraryGrid({ onSelect, refresh }:any) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media/all");
      if (!res.ok) {
        throw new Error("Failed to load media");
      }
      const data = await res.json();
      setMedia(data || []);
    } catch (error) {
      console.error("Error loading media:", error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading media...</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No media files found. Upload some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {media.map((m: any) => (
        <div
          key={m.id}
          onClick={() => onSelect && onSelect(m.url)}
          className={`border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
            onSelect ? "hover:border-blue-500" : ""
          }`}
        >
          <img
            src={m.url}
            alt={`Media ${m.id}`}
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.png";
            }}
          />
        </div>
      ))}
    </div>
  );
}
