export class AudioAnalyzer {
  private analyser: AnalyserNode
  private dataArray: Uint8Array
  private source: MediaStreamAudioSourceNode

  constructor(audioContext: AudioContext, stream: MediaStream) {
    // Create analyser node
    this.analyser = audioContext.createAnalyser()
    this.analyser.fftSize = 256 // Yields 128 frequency bins
    this.analyser.smoothingTimeConstant = 0.8

    // Connect microphone stream
    this.source = audioContext.createMediaStreamSource(stream)
    this.source.connect(this.analyser)

    // Initialize data array
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
  }

  getFrequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray)
    return this.dataArray
  }

  getAverageFrequency(): number {
    this.analyser.getByteFrequencyData(this.dataArray)
    const sum = this.dataArray.reduce((acc, val) => acc + val, 0)
    return sum / this.dataArray.length
  }

  getAverageVolume(): number {
    this.analyser.getByteFrequencyData(this.dataArray)
    let sum = 0
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i]
    }
    return sum / this.dataArray.length / 255 // Normalize to 0-1
  }

  disconnect(): void {
    this.source.disconnect()
  }
}
