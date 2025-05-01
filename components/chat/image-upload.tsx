"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UploadedImage } from "./types"

interface ImageUploadProps {
  images: UploadedImage[]
  onRemoveImage: (id: string) => void
  onAddImages: (files: FileList) => void
  isVisible: boolean
}

export default function ImageUpload({ images, onRemoveImage, onAddImages, isVisible }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddImages(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "w-full p-4 rounded-lg transition-all",
        isDragging ? "bg-primary/5 border-2 border-dashed border-primary/30" : "bg-transparent",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
      />

      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.thumbnail || "/placeholder.svg"}
                alt="Uploaded"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => onRemoveImage(image.id)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-90 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            onClick={triggerFileInput}
            className="w-20 h-20 flex items-center justify-center border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="w-full py-6 flex flex-col items-center justify-center border border-primary/20 border-dashed rounded-lg bg-primary/5 hover:bg-primary/10 cursor-pointer"
        >
          <p className="text-gray-700 mb-1">Drop images here or click to upload</p>
          <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  )
}
