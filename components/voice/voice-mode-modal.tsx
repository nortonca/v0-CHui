"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { ParticleSphere } from "./particle-sphere"
import { AudioAnalyzer } from "@/lib/audio-analyzer"
import { X, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceModeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VoiceModeModal({ isOpen, onClose }: VoiceModeModalProps) {
  const [animationState, setAnimationState] = useState<"paused" | "breathing" | "audio-reactive">("breathing")
  const [isListening, setIsListening] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const audioAnalyzerRef = useRef<AudioAnalyzer | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = "hidden"
    } else {
      // Unlock body scroll
      document.body.style.overflow = ""
      // Stop listening when modal closes
      stopListening()
    }

    return () => {
      document.body.style.overflow = ""
      stopListening()
    }
  }, [isOpen])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      
      audioAnalyzerRef.current = new AudioAnalyzer(audioContext, stream)
      setAnimationState("audio-reactive")
      setIsListening(true)
      
      console.log("[v0] Voice mode activated")
    } catch (error) {
      console.error("[v0] Microphone access denied:", error)
      alert("Microphone access is required for voice mode. Please grant permission and try again.")
    }
  }

  const stopListening = () => {
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
    console.log("[v0] Voice mode deactivated")
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full max-w-2xl max-h-[600px] bg-gradient-to-b from-background/95 to-background/90 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn border border-border/50">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-foreground" />
          <span className="sr-only">Close</span>
        </Button>

        {/* 3D Canvas */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ParticleSphere
              animationState={animationState}
              audioAnalyzer={audioAnalyzerRef.current}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Canvas>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-between p-8">
          {/* Top section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-semibold text-foreground">Voice Mode</h2>
              <p className="text-muted-foreground max-w-md">
                {isListening 
                  ? "Listening... Speak now and watch the particles react to your voice."
                  : "Tap the microphone button to start voice mode and see the visualization react to your voice."
                }
              </p>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex flex-col items-center gap-6">
            {/* Microphone button */}
            <button
              onClick={toggleListening}
              className={cn(
                "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                isListening
                  ? "bg-primary hover:bg-primary/90 scale-110"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {isListening ? (
                <Mic className="h-8 w-8 text-primary-foreground" />
              ) : (
                <MicOff className="h-8 w-8 text-muted-foreground" />
              )}
              
              {/* Pulse animation when listening */}
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-30" />
                </>
              )}
            </button>

            {/* Status text */}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isListening ? "Listening" : "Tap to speak"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isListening ? "Voice mode active" : "Voice mode inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
