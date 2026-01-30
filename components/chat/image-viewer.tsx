"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageViewerProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageViewer({ imageUrl, isOpen, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialDistance, setInitialDistance] = useState<number | null>(null)
  const [initialScale, setInitialScale] = useState(1)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobileRef = useRef(false)

  // Check if device is mobile
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
  }, [])

  // Reset state when image changes or viewer closes
  useEffect(() => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [imageUrl, isOpen])

  // Handle keyboard events (Escape to close, + to zoom in, - to zoom out)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "+":
        case "=":
          handleZoomIn()
          break
        case "-":
        case "_":
          handleZoomOut()
          break
        case "r":
        case "R":
          handleRotate()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"

      // On iOS, we need to prevent touchmove on the body
      const preventTouchMove = (e: TouchEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          e.preventDefault()
        }
      }

      document.addEventListener("touchmove", preventTouchMove, { passive: false })

      return () => {
        document.body.style.overflow = ""
        document.removeEventListener("touchmove", preventTouchMove)
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Add viewer-open class to body when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("viewer-open", "prevent-overscroll")
    } else {
      document.body.classList.remove("viewer-open", "prevent-overscroll")
    }

    return () => {
      document.body.classList.remove("viewer-open", "prevent-overscroll")
    }
  }, [isOpen])

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Handle pinch-to-zoom
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
      setInitialDistance(distance)
      setInitialScale(scale)
      return
    }

    // Handle drag
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Handle pinch-to-zoom
    if (e.touches.length === 2 && initialDistance !== null) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      // Calculate new scale based on the change in distance
      const newScale = (distance / initialDistance) * initialScale
      setScale(Math.min(Math.max(newScale, 0.5), 3))
      e.preventDefault()
      return
    }

    // Handle drag
    if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
      e.preventDefault() // Prevent scrolling while dragging
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setInitialDistance(null)
  }

  // Double tap to zoom on mobile
  const lastTapRef = useRef(0)
  const handleTap = (e: React.TouchEvent) => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (scale > 1) {
        // Reset zoom if already zoomed in
        setScale(1)
        setPosition({ x: 0, y: 0 })
      } else {
        // Zoom in to where the user tapped
        setScale(2)
        // We could calculate position based on tap location, but for simplicity we'll just zoom to center
      }
      e.preventDefault()
    }

    lastTapRef.current = now
  }

  // Double click to reset zoom and position
  const handleDoubleClick = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center touch-none image-viewer-container prevent-overscroll"
      onClick={(e) => {
        // Close when clicking the background (not the image or controls)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
        aria-label="Close image viewer"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/50 p-3 rounded-full z-10 image-viewer-controls">
        <button
          onClick={handleZoomIn}
          className="text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-6 w-6" />
        </button>
        <button
          onClick={handleZoomOut}
          className="text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-6 w-6" />
        </button>
        <button
          onClick={handleRotate}
          className="text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Rotate image"
        >
          <RotateCw className="h-6 w-6" />
        </button>
        <button
          onClick={handleDownload}
          className="text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Download image"
        >
          <Download className="h-6 w-6" />
        </button>
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full flex items-center justify-center overflow-hidden",
          isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={imageUrl || "/placeholder.svg"}
          alt="Full screen view"
          className="max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: "center",
          }}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTap}
          draggable={false}
        />
      </div>
    </div>
  )
}
