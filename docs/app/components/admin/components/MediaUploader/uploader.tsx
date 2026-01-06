"use client";

import { useState } from "react";
import { storage } from "@/config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function MediaUploader({ onUploaded }:any) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const uploadFiles = async (event:any) => {
    const files = Array.from(event.target.files) as File[];
    if (files.length === 0) return;

    const urls: any = [];
    setUploading(true);
    setUploadedCount(0);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileRef = ref(storage, `media/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Wrap uploadTask in a Promise
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Calculate progress for current file
            const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // Calculate overall progress across all files
            const overallProgress = ((i + fileProgress / 100) / files.length) * 100;
            setProgress(Math.round(overallProgress));
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              const url = await getDownloadURL(fileRef);
              urls.push(url);
              setUploadedCount(i + 1);

              // Save URL to database
              const response = await fetch("/api/media/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Failed to save media URL:", errorData);
              }

              resolve();
            } catch (error) {
              console.error("Error getting download URL or saving:", error);
              reject(error);
            }
          }
        );
      });
    }

    setUploading(false);
    setProgress(100);
    onUploaded(urls);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">
          Upload Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={uploadFiles}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadedCount} / {progress > 0 ? Math.ceil(progress / 100 * (uploadedCount + 1)) : 0} files</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{progress}% complete</p>
        </div>
      )}
    </div>
  );
}
