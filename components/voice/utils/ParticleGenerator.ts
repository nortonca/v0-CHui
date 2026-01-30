import * as THREE from "three"

export interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  originalPosition: THREE.Vector3
  scale: number
}

const PHI = (1 + Math.sqrt(5)) / 2 // Golden ratio

/**
 * Generate particles distributed on a sphere using golden ratio
 * @param count Number of particles to generate
 * @param radius Radius of the sphere
 * @returns Array of particles with positions and velocities
 */
export function generateParticlesOnSphere(count: number, radius: number): Particle[] {
  const particles: Particle[] = []

  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * (i / (count - 1)) - 1)
    const phi = (Math.PI * 2) * i / PHI

    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(theta)

    const position = new THREE.Vector3(x, y, z)
    const originalPosition = position.clone()

    particles.push({
      position,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ),
      originalPosition,
      scale: 0.5 + Math.random() * 0.5,
    })
  }

  return particles
}

/**
 * Update particle positions based on breathing animation
 * @param particles Array of particles to update
 * @param time Current animation time
 * @param breathingIntensity Intensity of breathing effect (0-1)
 */
export function updateParticlesBreathing(
  particles: Particle[],
  time: number,
  breathingIntensity: number = 0.3
): void {
  particles.forEach((particle, index) => {
    const frequency = 0.5 + (index % 5) * 0.1
    const offset = Math.sin(time * frequency) * breathingIntensity

    particle.position.copy(particle.originalPosition)
    particle.position.multiplyScalar(1 + offset)
  })
}

/**
 * Update particle positions based on audio frequency data
 * @param particles Array of particles to update
 * @param frequencyData Audio frequency data from analyser
 * @param intensity Intensity multiplier for displacement
 */
export function updateParticlesAudioReactive(
  particles: Particle[],
  frequencyData: Uint8Array,
  intensity: number = 2
): void {
  const particleCount = particles.length
  const binSize = frequencyData.length / particleCount

  particles.forEach((particle, index) => {
    const binIndex = Math.floor(index * binSize)
    const frequency = frequencyData[Math.min(binIndex, frequencyData.length - 1)] / 255

    // Displace particle based on frequency
    const displacement = frequency * intensity
    const direction = particle.originalPosition.clone().normalize()

    particle.position.copy(particle.originalPosition)
    particle.position.addScaledVector(direction, displacement)
  })
}

/**
 * Apply damping to particle velocities
 * @param particles Array of particles to update
 * @param damping Damping factor (0-1)
 */
export function applyParticleDamping(particles: Particle[], damping: number = 0.95): void {
  particles.forEach((particle) => {
    particle.velocity.multiplyScalar(damping)
  })
}
