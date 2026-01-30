import * as THREE from "three"
import type { Particle } from "./ParticleGenerator"

/**
 * Constants for animation configuration
 */
export const ANIMATION_CONFIG = {
  BREATHING_FREQUENCY: 0.5,
  BREATHING_INTENSITY: 0.3,
  AUDIO_INTENSITY: 2,
  DAMPING: 0.95,
  MAX_SCALE: 2,
  MIN_SCALE: 0.5,
} as const

/**
 * State management for particle animation
 */
export interface AnimationState {
  mode: "breathing" | "audio" | "paused"
  time: number
  audioData?: Uint8Array
  intensity: number
}

/**
 * Initialize animation state
 */
export function initializeAnimationState(): AnimationState {
  return {
    mode: "breathing",
    time: 0,
    intensity: ANIMATION_CONFIG.BREATHING_INTENSITY,
  }
}

/**
 * Update animation state based on elapsed time
 */
export function updateAnimationState(
  state: AnimationState,
  deltaTime: number
): AnimationState {
  return {
    ...state,
    time: state.time + deltaTime,
  }
}

/**
 * Get color based on animation state and particle intensity
 * @param intensity Particle intensity (0-1)
 * @param animationMode Current animation mode
 * @returns THREE.Color instance
 */
export function getParticleColor(intensity: number, animationMode: string): THREE.Color {
  const color = new THREE.Color()

  if (animationMode === "audio") {
    // Orange with intensity modulation for audio mode
    const hue = 0.05 + intensity * 0.05 // Orange hue range
    const saturation = 0.8 + intensity * 0.2
    const lightness = 0.4 + intensity * 0.3

    color.setHSL(hue, saturation, lightness)
  } else {
    // Softer orange for breathing mode
    const hue = 0.08
    const saturation = 0.7
    const lightness = 0.45 + intensity * 0.15

    color.setHSL(hue, saturation, lightness)
  }

  return color
}

/**
 * Calculate particle opacity based on mode and state
 */
export function calculateParticleOpacity(
  particle: Particle,
  state: AnimationState,
  index: number
): number {
  const baseOpacity = 0.6 + particle.scale * 0.3

  if (state.mode === "audio") {
    const pulse = Math.sin((state.time + index) * 2) * 0.2
    return Math.min(1, baseOpacity + pulse)
  }

  return baseOpacity
}

/**
 * Calculate particle size based on animation state
 */
export function calculateParticleSize(
  particle: Particle,
  state: AnimationState,
  index: number
): number {
  const baseSize = particle.scale * 8

  if (state.mode === "audio") {
    const pulse = Math.sin((state.time + index) * 3) * 0.3 + 1
    return Math.min(
      ANIMATION_CONFIG.MAX_SCALE * 8,
      Math.max(ANIMATION_CONFIG.MIN_SCALE * 8, baseSize * pulse)
    )
  }

  const breathing = Math.sin(state.time * ANIMATION_CONFIG.BREATHING_FREQUENCY + index) * 0.2 + 1
  return baseSize * breathing
}
