"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { ParticleSphere } from "./particle-sphere"
import { AudioAnalyzer } from "@/lib/audio-analyzer"
import { X, Mic, Square, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceModeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VoiceModeModal({ isOpen, onClose }: VoiceModeModalProps) {
  const [animationState, setAnimationState] = useState<"paused" | "breathing" | "audio-reactive">("breathing")
  const [isListening, setIsListening] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [statusText, setStatusText] = useState("Tap to start speaking")
  const audioAnalyzerRef = useRef<AudioAnalyzer | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  const stopListening = useCallback(() => {
    if (audioAnalyzerRef.current) {
      audioAnalyzerRef.current.disconnect()
      audioAnalyzerRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setAnimationState("breathing")
    setIsListening(false)
    setStatusText("Tap to start speaking")
  }, [])

  const handleClose = useCallback(() => {
    stopListening()
    onClose()
  }, [stopListening, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      
      // Handle escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose()
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
        stopListening()
      }
    } else {
      document.body.style.overflow = ""
      stopListening()
    }
  }, [isOpen, stopListening, handleClose])

  const startListening = async () => {
    try {
      setStatusText("Requesting microphone access...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      
      audioAnalyzerRef.current = new AudioAnalyzer(audioContext, stream)
      setAnimationState("audio-reactive")
      setIsListening(true)
      setStatusText("Listening...")
    } catch (error) {
      console.error("Microphone access denied:", error)
      setStatusText("Microphone access denied")
      setTimeout(() => setStatusText("Tap to start speaking"), 2000)
    }
  }

  const toggleListening = () => {
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/95 backdrop-blur-md animate-fadeIn"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className={cn(
          "relative w-full max-w-lg h-full max-h-[680px]",
          "bg-card border border-border rounded-3xl shadow-2xl overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isListening ? "bg-primary animate-pulse" : "bg-muted-foreground"
            )} />
            <h2 id="voice-modal-title" className="text-lg font-semibold text-foreground">
              Voice Mode
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 hover:bg-muted rounded-xl transition-colors"
            aria-label="Close voice mode"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* 3D Visualization Area */}
        <div className="relative flex-1 min-h-0">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/50 pointer-events-none z-10" />
          
          {/* Radial glow effect */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isListening ? "opacity-100" : "opacity-60"
          )}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            {isListening && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            )}
          </div>

          {/* Canvas */}
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ParticleSphere
              animationState={animationState}
              audioAnalyzer={audioAnalyzerRef.current}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Canvas>
        </div>

        {/* Controls Footer */}
        <div className="px-6 py-6 border-t border-border bg-card/80 backdrop-blur-sm">
          {/* Status text */}
          <p className="text-sm text-center text-muted-foreground mb-5">
            {statusText}
          </p>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Switch to keyboard button */}
            <button
              onClick={handleClose}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                "bg-muted hover:bg-muted/80 transition-all duration-200",
                "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Switch to keyboard"
            >
              <Keyboard className="size-5" />
            </button>

            {/* Main microphone button */}
            <button
              onClick={toggleListening}
              className={cn(
                "relative flex items-center justify-center w-16 h-16 rounded-full",
                "transition-all duration-300 shadow-lg",
                isListening
                  ? "bg-primary hover:bg-primary/90 scale-105"
                  : "bg-primary hover:bg-primary/90"
              )}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <Square className="size-6 text-white" fill="currentColor" />
              ) : (
                <Mic className="size-6 text-white" />
              )}
              
              {/* Ripple effect when listening */}
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                  <span className="absolute -inset-2 rounded-full border-2 border-primary animate-pulse" />
                </>
              )}
            </button>

            {/* Placeholder for symmetry */}
            <div className="w-12 h-12" />
          </div>

          {/* Keyboard hint */}
          <p className="text-xs text-center text-muted-foreground mt-5">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}
