'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type MediaItem = {
  file: string
  publicPath: string
  apiPath: string
}

type Props = {
  onSelect: (image: string | string[]) => void
  onDelete?: (image: string) => void
  multiSelect?: boolean
}

export default function MediaLibrary({ onSelect, onDelete, multiSelect = false }: Props) {
  const [images, setImages] = useState<MediaItem[]>([])
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)
  const [selectedImages, setSelectedImages] = useState<MediaItem[]>([])

  useEffect(() => {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => setImages(data.images || []))
  }, [])

  const handleCloseModal = () => {
    setSelectedImage(null)
    setSelectedImages([])
  }

  const handleDelete = async (item: MediaItem) => {
    // For deletion we need the public path (actual file under /public)
    const cleanPath = item.publicPath.replace(window.location.origin, '')

    const res = await fetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: cleanPath })
    })

    if (!res.ok) {
      const err = await res.json()
      alert(err.message || 'Delete failed')
      return
    }

    // Update local UI
    setImages(prev => prev.filter(img => img.file !== item.file))
    setSelectedImage(null)

    // Notify parent with the API path (what parent stored when selecting)
    onDelete?.(item.apiPath)
  }

  const handleSelect = (item?: MediaItem) => {
    if (multiSelect) {
      onSelect(selectedImages.map(i => i.apiPath))
      setSelectedImages([])
    } else if (item) {
      onSelect(item.apiPath)
    }
    setSelectedImage(null)
  }

  const toggleSelectImage = (item: MediaItem) => {
    setSelectedImages(prev => {
      if (prev.some(i => i.file === item.file)) return prev.filter(i => i.file !== item.file)
      return [...prev, item]
    })
  }

  return (
    <div className="space-y-4 px-4 py-6">
      <h2 className="text-lg font-semibold">Media Library</h2>

      {/* GRID */}
      <div className="grid grid-cols-5 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className={`cursor-pointer hover:opacity-80 relative ${multiSelect && selectedImages.some(i => i.file === image.file) ? 'ring-4 ring-[#FC6E88]/40 rounded' : ''}`}
            onClick={() => {
              if (multiSelect) toggleSelectImage(image)
              else setSelectedImage(image)
            }}
          >
            <Image
              src={image.apiPath}
              alt={`Media ${idx}`}
              width={128}
              height={228}
              className="w-full h-52 object-cover rounded"
            />
            {multiSelect && selectedImages.some(i => i.file === image.file) && (
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs">✓</div>
            )}
          </div>
        ))}
      </div>

      {/* Quick action for multi-select: add selected without opening modal */}
      {multiSelect && selectedImages.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">{selectedImages.length} selected</div>
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedImages([]) }}
              className="px-3 py-1 text-sm border rounded text-gray-700"
            >
              Clear
            </button>
            <button
              onClick={() => handleSelect()}
              className="px-3 py-1 text-sm bg-[#FC6E88] text-white rounded"
            >
              Add Selected ({selectedImages.length})
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      { (selectedImage || (multiSelect && selectedImages.length > 0)) && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-xl max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* If multiSelect, show selected thumbnails; else show the single selected image */}
            {multiSelect ? (
              <div>
                <h3 className="font-medium mb-3">Selected ({selectedImages.length})</h3>
                <div className="flex gap-3 mb-4 overflow-x-auto">
                  {selectedImages.map((img, i) => (
                    <div key={i} className="w-28 h-28 rounded overflow-hidden border">
                      <Image src={img.apiPath} alt={`Sel ${i}`} width={200} height={200} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              selectedImage && (
                <Image
                  src={selectedImage.apiPath}
                  alt="Selected"
                  width={800}
                  height={800}
                  className="w-full max-h-[70vh] object-contain rounded"
                />
              )
            )}

            {/* ACTIONS */}
            <div className="flex justify-between mt-5">
              {!multiSelect && selectedImage && (
                <button
                  onClick={() => handleDelete(selectedImage)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleSelect(selectedImage || undefined)}
                  className="px-4 py-2 bg-[#FC6E88] text-white rounded-lg"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
