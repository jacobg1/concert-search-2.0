import { useState, MouseEvent, useEffect, useLayoutEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { PlayerState, PopoverHandler, SongPositionHandler } from './interface'
import { mediaHandlers } from './mediaHandlers'
import type { RootState, AppDispatch } from './store'

const { Play, Pause } = PlayerState

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function usePopover<T>(): [
  T | null,
  boolean,
  PopoverHandler<T>,
  PopoverHandler<T>
] {
  const [htmlEl, setHtmlEl] = useState<T | null>(null)
  const isOpen = Boolean(htmlEl)

  const handleOpen = (event: MouseEvent<T>) => {
    setHtmlEl(event.currentTarget)
  }

  const handleClose = (_e: MouseEvent<T>) => {
    setHtmlEl(null)
  }

  return [htmlEl, isOpen, handleOpen, handleClose]
}

export function useVolumeChange(
  current: HTMLAudioElement | null,
  volume: number,
  playerState: PlayerState
): void {
  useEffect(() => {
    if (current) {
      current.volume = (volume as number) / 100
    }
  }, [volume, playerState])
}

const setMediaSessionState = (sessionState: 'playing' | 'paused') => {
  if (navigator?.mediaSession) {
    navigator.mediaSession.playbackState = sessionState
  }
}

export function usePlayPause(
  current: HTMLAudioElement | null,
  playUrl: string,
  playerState: PlayerState
): void {
  useEffect(() => {
    if (!current) return

    if (playerState === Play) {
      current.play()
      setMediaSessionState('playing')
    } else {
      current.pause()
      setMediaSessionState('paused')
    }
  }, [playerState, playUrl])
}

export function useSongDuration(
  current: HTMLAudioElement | null,
  playUrl: string
): number {
  const [duration, setDuration] = useState(0)

  if (current) {
    current.onloadedmetadata = () => {
      setDuration(current.duration)
    }
  }

  useEffect(() => {
    if (!playUrl) setDuration(0)
  }, [playUrl])

  return duration
}

type SongPosition = [
  position: number,
  setSongPosition: SongPositionHandler,
  resetSongPosition: () => void
]

export function useSongPosition(
  current: HTMLAudioElement | null,
  playUrl: string,
  playerState: string
): SongPosition {
  const [position, setPosition] = useState(0)

  if (current) {
    current.ontimeupdate = () => {
      setPosition(Math.floor(current.currentTime))
    }
  }

  useEffect(() => {
    if (!playUrl) setPosition(0)
  }, [playUrl])

  const setSongPosition = (songPosition: number) => {
    if (current) {
      // Pause track
      current.pause()
      setMediaSessionState('paused')

      // Set position and currentTime
      setPosition(songPosition)
      current.currentTime = Math.floor(songPosition)

      // Start track back up
      if (current.paused && playerState !== Pause) {
        current.play()
        setMediaSessionState('playing')
      }
    }
  }

  const resetSongPosition = () => {
    if (!current) return
    setPosition(0)
    current.currentTime = 0
  }

  return [position, setSongPosition, resetSongPosition]
}

type IAudioContext = [
  dataArray: Uint8Array,
  audioBufferLength: number,
  analyser?: AnalyserNode
]

// Initial analyser set up. Needs to only run once.
export function useAudioContext(
  current: HTMLAudioElement | null
): IAudioContext {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array())
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>(undefined)
  const [audioBufferLength, setAudioBufferLength] = useState<number>(0)

  useEffect(() => {
    if (current) {
      const audioContext = new (AudioContext ||
        (window as any).webkitAudioContext)()
      const source = audioContext.createMediaElementSource(current)

      // To ensure track actually plays
      current.onplay = () => audioContext.resume()

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
    }
  }, [current])

  return [dataArray, audioBufferLength, analyser]
}

export function useResize(maxWidth: number) {
  const [windowSize, setWindowSize] = useState([0, 0])

  useLayoutEffect(() => {
    const setSize = () => {
      const { innerHeight, innerWidth } = window
      const width = innerWidth < maxWidth ? innerWidth : maxWidth
      setWindowSize([innerHeight, width])
    }
    window.addEventListener('resize', setSize)
    setSize()
    return () => window.removeEventListener('resize', setSize)
  }, [])

  return windowSize
}

export function useMediaSession(
  currentTrackName: string,
  current: HTMLAudioElement | null
) {
  const { metadata, trackList } = useAppSelector(
    (state) => state.individualConcert.selectedConcert
  )
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (current && navigator?.mediaSession) {
      mediaHandlers(current, dispatch).forEach(({ action, handler }) =>
        navigator.mediaSession.setActionHandler(action, handler)
      )
    }
  }, [current])

  useEffect(() => {
    if (metadata && navigator?.mediaSession) {
      const findTitle = trackList.find(({ name }) => currentTrackName === name)

      navigator.mediaSession.metadata = new MediaMetadata({
        title: findTitle ? findTitle.title : currentTrackName,
        artist: metadata.creator,
        album: metadata.title,
      })
    }
  }, [metadata, currentTrackName])
}
