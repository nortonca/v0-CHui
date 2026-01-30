'use client';

import { useState, useEffect, useRef, useCallback } from "react"

/**
 * Hook for managing responsive layout on mobile devices
 * Handles viewport height tracking and mobile detection
 */
export function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)

      const vh = window.innerHeight
      setViewportHeight(vh)

      if (isMobileDevice && mainContainerRef.current) {
        mainContainerRef.current.style.height = `${vh}px`
      }
    }

    checkMobileAndViewport()

    if (mainContainerRef.current) {
      mainContainerRef.current.style.height = isMobile ? `${viewportHeight}px` : "100svh"
    }

    window.addEventListener("resize", checkMobileAndViewport)

    return () => {
      window.removeEventListener("resize", checkMobileAndViewport)
    }
  }, [isMobile, viewportHeight])

  return {
    isMobile,
    viewportHeight,
    mainContainerRef,
  }
}

/**
 * Hook for managing focus on textarea after streaming
 */
export function useTextareaFocus(isStreaming: boolean, isMobile: boolean) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shouldFocusRef = useRef(false)

  useEffect(() => {
    if (!isStreaming && shouldFocusRef.current && !isMobile) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
      shouldFocusRef.current = false
    }
  }, [isStreaming, isMobile])

  const markForFocus = useCallback(() => {
    shouldFocusRef.current = true
  }, [])

  return {
    textareaRef,
    markForFocus,
  }
}
