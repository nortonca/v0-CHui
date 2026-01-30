'use client';

import React from "react"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadedImage } from "../types"

interface ImageUploadSectionProps {
  images: UploadedImage[]
  onRemoveImage: (id: string) => void
  onAddImages: (files: File[]) => void
}

/**
 * ImageUploadSection Component
 * Displays uploaded images with preview and remove functionality
 * Handles image file input and management
 */
export function ImageUploadSection({
  images,
  onRemoveImage,
  onAddImages,
}: ImageUploadSectionProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onAddImages(files)
    }
  }

  return (
    <div className="space-y-2">
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 p-2 bg-muted rounded-lg">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                className="w-full h-20 object-cover rounded border border-border"
              />
              <button
                onClick={() => onRemoveImage(image.id)}
                className="absolute top-1 right-1 bg-destructive/80 hover:bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add More Button */}
          <label className="relative cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-full h-20 border-2 border-dashed border-border rounded flex items-center justify-center hover:border-primary/50 transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
          </label>
        </div>
      )}

      {/* Initial Upload Area */}
      {images.length === 0 && (
        <label className="block">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload images</p>
          </div>
        </label>
      )}
    </div>
  )
}
