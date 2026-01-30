/**
 * Audio Reactivity Utilities
 * Handles audio analysis and mapping to visual parameters
 */

export interface AudioAnalysisResult {
  frequency: number
  volume: number
  smoothedVolume: number
  bass: number
  mid: number
  treble: number
}

let smoothedVolume = 0
const smoothingFactor = 0.8

/**
 * Analyze audio frequency data and return insights
 * @param analyser Web Audio API AnalyserNode
 * @returns Analysis result with various frequency bands
 */
export function analyzeAudio(analyser: AnalyserNode): AudioAnalysisResult {
  const frequencyData = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(frequencyData)

  const length = frequencyData.length
  const bass = getFrequencyBandAverage(frequencyData, 0, length * 0.1)
  const mid = getFrequencyBandAverage(frequencyData, length * 0.1, length * 0.5)
  const treble = getFrequencyBandAverage(frequencyData, length * 0.5, length)

  const volume = (bass + mid + treble) / 3
  smoothedVolume = smoothedVolume * smoothingFactor + volume * (1 - smoothingFactor)

  const frequency = (bass * 0.2 + mid * 0.3 + treble * 0.5) / 255

  return {
    frequency,
    volume: volume / 255,
    smoothedVolume: smoothedVolume / 255,
    bass: bass / 255,
    mid: mid / 255,
    treble: treble / 255,
  }
}

/**
 * Get average frequency value for a specific band
 * @param frequencyData Frequency data array
 * @param start Start index
 * @param end End index
 * @returns Average frequency value in band
 */
function getFrequencyBandAverage(
  frequencyData: Uint8Array,
  start: number,
  end: number
): number {
  let sum = 0
  const count = end - start

  for (let i = start; i < end; i++) {
    sum += frequencyData[i]
  }

  return sum / count
}

/**
 * Map audio frequency to particle displacement intensity
 * @param analysis Audio analysis result
 * @param baseIntensity Base intensity value
 * @returns Displacement intensity
 */
export function mapAudioToDisplacement(analysis: AudioAnalysisResult, baseIntensity: number = 2): number {
  return baseIntensity * analysis.smoothedVolume * (1 + analysis.frequency)
}

/**
 * Map audio frequency to color intensity
 * @param analysis Audio analysis result
 * @returns Color intensity (0-1)
 */
export function mapAudioToColorIntensity(analysis: AudioAnalysisResult): number {
  return Math.min(1, analysis.smoothedVolume + analysis.frequency * 0.5)
}

/**
 * Map audio frequency to scale multiplier
 * @param analysis Audio analysis result
 * @returns Scale multiplier (0.5-1.5)
 * */
export function mapAudioToScale(analysis: AudioAnalysisResult): number {
  return 0.8 + analysis.smoothedVolume * 0.7
}
