/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, RefObject } from 'react'

type IAudioContext = [
  dataArray: Uint8Array,
  audioBufferLength: number,
  analyser?: AnalyserNode
]

// Initial analyser set up. Needs to only run once.
export function useAudioContext(
  audioEl: RefObject<HTMLAudioElement>
): IAudioContext {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array())
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>(undefined)
  const [audioBufferLength, setAudioBufferLength] = useState<number>(0)

  useEffect(() => {
    if (!audioEl.current) return

    const audioContext = new (AudioContext ||
      (window as any).webkitAudioContext)()

    const source = audioContext.createMediaElementSource(audioEl.current)

    // To ensure track actually plays
    audioEl.current.onplay = () => audioContext.resume()

    const audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.fftSize = 256

    // Connect analyser between source and destination
    source.connect(audioAnalyser)
    audioAnalyser.connect(audioContext.destination)

    const bufferLength = audioAnalyser.frequencyBinCount
    // Empty array will be filled with frequency data
    const data = new Uint8Array(bufferLength)

    setAudioBufferLength(bufferLength)
    setAnalyser(audioAnalyser)
    setDataArray(data)

    return () => {
      // Cleanup and disconnect
      source.disconnect(audioAnalyser)
      audioAnalyser.disconnect(audioContext.destination)
    }
  }, [])

  return [dataArray, audioBufferLength, analyser]
}
