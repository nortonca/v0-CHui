"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import Image from "next/image"
import type { UploadedImage } from "../types"

interface ImagePreviewProps {
  images: UploadedImage[]
  onRemove: (id: string) => void
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null

  return (
    <div className="mb-3 pt-2 pr-2 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative flex-shrink-0 group"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border bg-muted shadow-sm">
            <Image
              src={image.thumbnail || image.url}
              alt="Uploaded image"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          {/* X button - positioned inside bounds with padding */}
          <button
            type="button"
            onClick={() => onRemove(image.id)}
            className={cn(
              "absolute -top-2 -right-2 w-6 h-6 rounded-full",
              "bg-card border border-border shadow-md",
              "text-muted-foreground hover:text-destructive hover:border-destructive/30",
              "flex items-center justify-center",
              "transition-all duration-150"
            )}
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
