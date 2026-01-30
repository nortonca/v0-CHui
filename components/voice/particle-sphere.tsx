"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { AudioAnalyzer } from "@/lib/audio-analyzer"

export type AnimationState = "paused" | "breathing" | "audio-reactive"

interface ParticleSphereProps {
  animationState: AnimationState
  audioAnalyzer: AudioAnalyzer | null
  prefersReducedMotion: boolean
}

const AUDIO_VISUALIZER = {
  MAX_PARTICLES: 5000,
  PARTICLE_COUNT: 5000,
  SPHERE_RADIUS: 5,
  PARTICLE_SIZE: 0.12,
  PARTICLE_OPACITY: 0.9,
  ROTATION_SPEED: 0.0003,
  WAVE_SPEED: 2,
  WAVE_INTENSITY: 1,
  SENSITIVITY: 2,
  PAUSE_TRANSITION_DURATION: 2.0,
  RESUME_TRANSITION_DURATION: 2.0,
  BREATHING_FREQUENCY: 0.5,
  BREATHING_AMPLITUDE: 0.15,
  GENTLE_WAVE_FREQUENCY: 0.5,
  GENTLE_WAVE_AMPLITUDE: 0.1,
}

export function ParticleSphere({ animationState, audioAnalyzer, prefersReducedMotion }: ParticleSphereProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const pauseTransitionRef = useRef({
    isTransitioning: false,
    startTime: 0,
    duration: AUDIO_VISUALIZER.PAUSE_TRANSITION_DURATION,
    startPositions: new Float32Array(0),
    startScales: new Float32Array(0),
    startRotation: 0,
  })

  const resumeTransitionRef = useRef({
    isTransitioning: false,
    startTime: 0,
    duration: AUDIO_VISUALIZER.RESUME_TRANSITION_DURATION,
    startPositions: new Float32Array(0),
    startScales: new Float32Array(0),
    startRotation: 0,
  })

  const count = prefersReducedMotion ? 1000 : AUDIO_VISUALIZER.PARTICLE_COUNT

  const [positions, colors, scales, originalPositions] = useMemo(() => {
    const positions = new Float32Array(AUDIO_VISUALIZER.MAX_PARTICLES * 3)
    const colors = new Float32Array(AUDIO_VISUALIZER.MAX_PARTICLES * 3)
    const scales = new Float32Array(AUDIO_VISUALIZER.MAX_PARTICLES)
    const originalPositions = new Float32Array(AUDIO_VISUALIZER.MAX_PARTICLES * 3)
    const color = new THREE.Color()

    const goldenRatio = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < AUDIO_VISUALIZER.MAX_PARTICLES; i++) {
      // Golden ratio spiral distribution on sphere
      const theta = (2 * Math.PI * i) / goldenRatio
      const phi = Math.acos(1 - (2 * (i + 0.5)) / AUDIO_VISUALIZER.MAX_PARTICLES)
      const radius = AUDIO_VISUALIZER.SPHERE_RADIUS

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      // Orange gradient based on position - using app's primary color
      const distance = Math.sqrt(x * x + y * y + z * z)
      const normalizedDistance = distance / radius
      
      // Create orange gradient from bright orange to deep orange
      // Primary: hsl(24 95% 53%) = rgb(252, 109, 8)
      color.setHSL(0.067 + normalizedDistance * 0.02, 0.95, 0.45 + normalizedDistance * 0.15)

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      scales[i] = i < count ? 1 : 0
    }

    return [positions, colors, scales, originalPositions]
  }, [count])

  useEffect(() => {
    if (!pointsRef.current) return

    const positionAttribute = pointsRef.current.geometry.attributes.position
    const scaleAttribute = pointsRef.current.geometry.attributes.scale as THREE.BufferAttribute

    if (animationState === "paused") {
      pauseTransitionRef.current = {
        isTransitioning: true,
        startTime: 0,
        duration: AUDIO_VISUALIZER.PAUSE_TRANSITION_DURATION,
        startPositions: new Float32Array(positionAttribute.array),
        startScales: new Float32Array(scaleAttribute.array),
        startRotation: pointsRef.current.rotation.z,
      }
    } else {
      resumeTransitionRef.current = {
        isTransitioning: true,
        startTime: 0,
        duration: AUDIO_VISUALIZER.RESUME_TRANSITION_DURATION,
        startPositions: new Float32Array(positionAttribute.array),
        startScales: new Float32Array(scaleAttribute.array),
        startRotation: pointsRef.current.rotation.z,
      }
    }
  }, [animationState])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const time = clock.getElapsedTime()
    const positionAttribute = pointsRef.current.geometry.attributes.position
    const scaleAttribute = pointsRef.current.geometry.attributes.scale as THREE.BufferAttribute

    // Handle pause transition
    if (pauseTransitionRef.current.isTransitioning) {
      if (pauseTransitionRef.current.startTime === 0) {
        pauseTransitionRef.current.startTime = time
      }

      const elapsed = time - pauseTransitionRef.current.startTime
      const progress = Math.min(elapsed / AUDIO_VISUALIZER.PAUSE_TRANSITION_DURATION, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      for (let i = 0; i < count; i++) {
        const startX = pauseTransitionRef.current.startPositions[i * 3]
        const startY = pauseTransitionRef.current.startPositions[i * 3 + 1]
        const startZ = pauseTransitionRef.current.startPositions[i * 3 + 2]
        const startScale = pauseTransitionRef.current.startScales[i]

        const targetX = originalPositions[i * 3]
        const targetY = originalPositions[i * 3 + 1]
        const targetZ = originalPositions[i * 3 + 2]
        const targetScale = 1

        const x = startX + (targetX - startX) * easeOut
        const y = startY + (targetY - startY) * easeOut
        const z = startZ + (targetZ - startZ) * easeOut
        const scale = startScale + (targetScale - startScale) * easeOut

        positionAttribute.setXYZ(i, x, y, z)
        scaleAttribute.setX(i, scale)
      }

      pointsRef.current.rotation.z =
        pauseTransitionRef.current.startRotation + (0 - pauseTransitionRef.current.startRotation) * easeOut

      positionAttribute.needsUpdate = true
      scaleAttribute.needsUpdate = true

      if (progress >= 1) {
        pauseTransitionRef.current.isTransitioning = false
      }

      return
    }

    // Handle resume transition
    if (resumeTransitionRef.current.isTransitioning) {
      if (resumeTransitionRef.current.startTime === 0) {
        resumeTransitionRef.current.startTime = time
      }

      const elapsed = time - resumeTransitionRef.current.startTime
      const progress = Math.min(elapsed / AUDIO_VISUALIZER.RESUME_TRANSITION_DURATION, 1)
      const easeInOut = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

      let frequencyData: Uint8Array | null = null
      let averageVolume = 0

      if (audioAnalyzer) {
        frequencyData = audioAnalyzer.getFrequencyData()
        averageVolume = audioAnalyzer.getAverageVolume()
      }

      pointsRef.current.rotation.z += AUDIO_VISUALIZER.ROTATION_SPEED

      for (let i = 0; i < count; i++) {
        const startX = resumeTransitionRef.current.startPositions[i * 3]
        const startY = resumeTransitionRef.current.startPositions[i * 3 + 1]
        const startZ = resumeTransitionRef.current.startPositions[i * 3 + 2]
        const startScale = resumeTransitionRef.current.startScales[i]

        const originalX = originalPositions[i * 3]
        const originalY = originalPositions[i * 3 + 1]
        const originalZ = originalPositions[i * 3 + 2]

        let targetX, targetY, targetZ, targetScale

        if (animationState === "audio-reactive" && frequencyData && audioAnalyzer) {
          const frequencyBand = Math.floor((i / count) * frequencyData.length)
          const frequencyValue = frequencyData[frequencyBand] / 255

          const waveX = Math.sin(time * AUDIO_VISUALIZER.WAVE_SPEED + originalY) * AUDIO_VISUALIZER.WAVE_INTENSITY
          const waveY = Math.sin(time * AUDIO_VISUALIZER.WAVE_SPEED + originalZ) * AUDIO_VISUALIZER.WAVE_INTENSITY
          const waveZ = Math.sin(time * AUDIO_VISUALIZER.WAVE_SPEED + originalX) * AUDIO_VISUALIZER.WAVE_INTENSITY

          const displacement = frequencyValue * averageVolume * AUDIO_VISUALIZER.SENSITIVITY + 1

          targetX = (originalX + waveX) * displacement
          targetY = (originalY + waveY) * displacement
          targetZ = (originalZ + waveZ) * displacement
          targetScale = displacement
        } else {
          const breathingEffect =
            Math.sin(time * AUDIO_VISUALIZER.BREATHING_FREQUENCY) * AUDIO_VISUALIZER.BREATHING_AMPLITUDE + 1

          const waveX =
            Math.sin(time * AUDIO_VISUALIZER.GENTLE_WAVE_FREQUENCY + originalY * 0.1) *
            AUDIO_VISUALIZER.GENTLE_WAVE_AMPLITUDE
          const waveY =
            Math.sin(time * AUDIO_VISUALIZER.GENTLE_WAVE_FREQUENCY + originalZ * 0.1) *
            AUDIO_VISUALIZER.GENTLE_WAVE_AMPLITUDE
          const waveZ =
            Math.sin(time * AUDIO_VISUALIZER.GENTLE_WAVE_FREQUENCY + originalX * 0.1) *
            AUDIO_VISUALIZER.GENTLE_WAVE_AMPLITUDE

          targetX = (originalX + waveX) * breathingEffect
          targetY = (originalY + waveY) * breathingEffect
          targetZ = (originalZ + waveZ) * breathingEffect
          targetScale = breathingEffect
        }

        const x = startX + (targetX - startX) * easeInOut
        const y = startY + (targetY - startY) * easeInOut
        const z = startZ + (targetZ - startZ) * easeInOut
        const scale = startScale + (targetScale - startScale) * easeInOut

        positionAttribute.setXYZ(i, x, y, z)
        scaleAttribute.setX(i, scale)
      }

      positionAttribute.needsUpdate = true
      scaleAttribute.needsUpdate = true

      if (progress >= 1) {
        resumeTransitionRef.current.isTransitioning = false
      }

      return
    }

    // Normal animation states
    if (animationState !== "paused") {
      pointsRef.current.rotation.z += AUDIO_VISUALIZER.ROTATION_SPEED

      if (animationState === "audio-reactive" && audioAnalyzer) {
        const frequencyData = audioAnalyzer.getFrequencyData()
        const averageVolume = audioAnalyzer.getAverageVolume()

        for (let i = 0; i < count; i++) {
          const originalX = originalPositions[i * 3]
          const originalY = originalPositions[i * 3 + 1]
          const originalZ = originalPositions[i * 3 + 2]

          const frequencyBand = Math.floor((i / count) * frequencyData.length)
          const frequencyValue = frequencyData[frequencyBand] / 255

          const waveX = Math.sin(time * AUDIO_VISUALIZER.WAVE_SPEED + originalY) * AUDIO_VISUALIZER.WAVE_INTENSITY
          const waveY = Math.sin(time * AUDIO_VISUALIZER.WAVE_SPEED + originalZ) * AUDIO_VISUALIZER.WAVE_INTENSITY
          const waveZ = Math.sin(time * AUDIO_VISUALIZER.WAVE_SPEED + originalX) * AUDIO_VISUALIZER.WAVE_INTENSITY

          const displacement = frequencyValue * averageVolume * AUDIO_VISUALIZER.SENSITIVITY + 1

          const x = (originalX + waveX) * displacement
          const y = (originalY + waveY) * displacement
          const z = (originalZ + waveZ) * displacement

          positionAttribute.setXYZ(i, x, y, z)
          scaleAttribute.setX(i, displacement)
        }
      } else {
        // Breathing animation
        const breathingEffect =
          Math.sin(time * AUDIO_VISUALIZER.BREATHING_FREQUENCY) * AUDIO_VISUALIZER.BREATHING_AMPLITUDE + 1

        for (let i = 0; i < count; i++) {
          const originalX = originalPositions[i * 3]
          const originalY = originalPositions[i * 3 + 1]
          const originalZ = originalPositions[i * 3 + 2]

          const waveX =
            Math.sin(time * AUDIO_VISUALIZER.GENTLE_WAVE_FREQUENCY + originalY * 0.1) *
            AUDIO_VISUALIZER.GENTLE_WAVE_AMPLITUDE
          const waveY =
            Math.sin(time * AUDIO_VISUALIZER.GENTLE_WAVE_FREQUENCY + originalZ * 0.1) *
            AUDIO_VISUALIZER.GENTLE_WAVE_AMPLITUDE
          const waveZ =
            Math.sin(time * AUDIO_VISUALIZER.GENTLE_WAVE_FREQUENCY + originalX * 0.1) *
            AUDIO_VISUALIZER.GENTLE_WAVE_AMPLITUDE

          const x = (originalX + waveX) * breathingEffect
          const y = (originalY + waveY) * breathingEffect
          const z = (originalZ + waveZ) * breathingEffect

          positionAttribute.setXYZ(i, x, y, z)
          scaleAttribute.setX(i, breathingEffect)
        }
      }

      positionAttribute.needsUpdate = true
      scaleAttribute.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={AUDIO_VISUALIZER.MAX_PARTICLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-color" count={AUDIO_VISUALIZER.MAX_PARTICLES} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-scale" count={AUDIO_VISUALIZER.MAX_PARTICLES} array={scales} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={AUDIO_VISUALIZER.PARTICLE_SIZE}
        vertexColors
        transparent
        opacity={AUDIO_VISUALIZER.PARTICLE_OPACITY}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
