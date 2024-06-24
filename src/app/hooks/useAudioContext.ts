/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, RefObject } from 'react'

type IAudioContext = [audioBufferLength: number, analyser?: AnalyserNode]

// Initial analyser set up. Needs to only run once.
export function useAudioContext(
  audioEl: RefObject<HTMLAudioElement>
): IAudioContext {
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>(undefined)
  const [audioBufferLength, setAudioBufferLength] = useState<number>(0)

  let source: MediaElementAudioSourceNode
  let audioContext: AudioContext

  useEffect(() => {
    if (!audioEl.current) return

    if (!audioContext) {
      audioContext = new (AudioContext || (window as any).webkitAudioContext)()
    }

    if (!source) {
      source = audioContext.createMediaElementSource(audioEl.current)
    }

    // To ensure track actually plays
    audioEl.current.onplay = () => audioContext.resume()

    const audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.fftSize = 256

    // Connect analyser between source and destination
    source.connect(audioAnalyser)
    audioAnalyser.connect(audioContext.destination)

    const bufferLength = audioAnalyser.frequencyBinCount

    setAudioBufferLength(bufferLength)
    setAnalyser(audioAnalyser)

    return () => {
      // Cleanup and disconnect
      source.disconnect(audioAnalyser)
      audioAnalyser.disconnect(audioContext.destination)
    }
  }, [])

  return [audioBufferLength, analyser]
}
