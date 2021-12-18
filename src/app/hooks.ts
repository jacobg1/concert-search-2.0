import { useState, MouseEvent, useEffect, useRef } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { PopoverHandler, SongPositionHandler } from './interface'
import type { RootState, AppDispatch } from './store'

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
  playerState: 'play' | 'pause'
): void {
  useEffect(() => {
    if (current) {
      current.volume = (volume as number) / 100
    }
  }, [volume, playerState])
}

export function usePlayPause(
  current: HTMLAudioElement | null,
  playUrl: string,
  playerState: 'play' | 'pause'
): void {
  useEffect(() => {
    if (!current) return

    if (playerState === 'play') {
      current.play()
    } else {
      current.pause()
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
  playUrl: string
): SongPosition {
  const [position, setPosition] = useState(0)

  if (current) {
    current.ontimeupdate = () => {
      if (current.paused) return
      setPosition(Math.floor(current.currentTime))
    }
  }

  useEffect(() => {
    if (!playUrl) setPosition(0)
  }, [playUrl])

  const setSongPosition = (songPosition: number) => {
    if (current && current.readyState > 2) {
      // Pause track
      current.pause()

      // Set position and currentTime
      setPosition(songPosition)
      current.currentTime = Math.floor(songPosition)

      // Start track back up
      if (current.paused) {
        current.play()
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
