"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { UploadedImage } from "../types"

interface ImagePreviewProps {
  images: UploadedImage[]
  onRemove: (id: string) => void
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  
  const isLightboxOpen = lightboxIndex !== null
  const currentImage = isLightboxOpen ? images[lightboxIndex] : null

  // Close lightbox on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLightboxOpen) return
    
    if (e.key === "Escape") {
      setLightboxIndex(null)
    } else if (e.key === "ArrowLeft" && lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    } else if (e.key === "ArrowRight" && lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }, [isLightboxOpen, lightboxIndex, images.length])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isLightboxOpen])

  if (images.length === 0) return null

  return (
    <>
      {/* Thumbnail Strip */}
      <div className="mb-3 pt-2 pr-2 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative flex-shrink-0 group"
          >
            {/* Clickable Image */}
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border bg-muted shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Image
                src={image.thumbnail || image.url}
                alt="Uploaded image"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </button>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(image.id)
              }}
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

      {/* Lightbox Modal - Matches app modal pattern */}
      {isLightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          {/* Backdrop - matches voice mode modal */}
          <div 
            className="absolute inset-0 bg-background/95 backdrop-blur-md animate-fadeIn"
            onClick={() => setLightboxIndex(null)}
            aria-hidden="true"
          />
          
          {/* Modal Container - matches app modal pattern */}
          <div 
            className={cn(
              "relative w-full max-w-4xl max-h-[90vh]",
              "bg-card border border-border rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden",
              "animate-scaleIn flex flex-col"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Image Preview
                </h2>
                {images.length > 1 && (
                  <span className="text-sm text-muted-foreground">
                    {lightboxIndex + 1} of {images.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 -mr-2 hover:bg-muted rounded-xl transition-colors"
                aria-label="Close preview"
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            {/* Image Area */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center p-4 md:p-6 bg-muted/30">
              <Image
                src={currentImage.url || "/placeholder.svg"}
                alt="Preview image"
                width={1200}
                height={800}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />

              {/* Navigation arrows - inside the image area */}
              {images.length > 1 && (
                <>
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
                    disabled={lightboxIndex === 0}
                    className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2",
                      "w-10 h-10 rounded-full",
                      "bg-card border border-border shadow-md",
                      "text-foreground hover:bg-muted",
                      "flex items-center justify-center",
                      "transition-all duration-150",
                      "disabled:opacity-30 disabled:cursor-not-allowed"
                    )}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(Math.min(images.length - 1, lightboxIndex + 1))}
                    disabled={lightboxIndex === images.length - 1}
                    className={cn(
                      "absolute right-4 top-1/2 -translate-y-1/2",
                      "w-10 h-10 rounded-full",
                      "bg-card border border-border shadow-md",
                      "text-foreground hover:bg-muted",
                      "flex items-center justify-center",
                      "transition-all duration-150",
                      "disabled:opacity-30 disabled:cursor-not-allowed"
                    )}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Footer with keyboard hints */}
            <div className="hidden md:flex items-center justify-center gap-6 px-4 py-3 border-t border-border bg-card">
              <span className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono mr-1">ESC</kbd>
                to close
              </span>
              {images.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono mr-1">←</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono mr-1">→</kbd>
                  to navigate
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
