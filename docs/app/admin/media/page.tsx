"use client";

import MediaUploader from "@/app/components/admin/components/MediaUploader/uploader";
import MediaLibraryGrid from "@/app/components/admin/components/MediaLibraryGrid/media";
import { useState } from "react";

export default function MediaLibraryPage() {
  const [refresh, setRefresh] = useState(false);

  const handleImageSelect = (url: string) => {
    // You can add functionality here to copy URL or handle selection
    console.log("Selected image URL:", url);
    // Optionally copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      alert("Image URL copied to clipboard!");
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Media Library</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <MediaUploader onUploaded={() => setRefresh(!refresh)} />
      </div>

      {/* Images Grid */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">All Media Files</h2>
        <MediaLibraryGrid refresh={refresh} onSelect={handleImageSelect} />
      </div>
    </div>
  );
}
