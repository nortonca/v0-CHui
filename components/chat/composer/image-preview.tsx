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
    <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative flex-shrink-0 group"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border bg-muted">
            <Image
              src={image.thumbnail || image.url}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(image.id)}
            className={cn(
              "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full",
              "bg-destructive text-destructive-foreground",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 sm:opacity-100",
              "transition-opacity shadow-sm"
            )}
            aria-label="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
