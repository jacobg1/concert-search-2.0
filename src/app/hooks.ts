import { useState, MouseEvent, useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { PopoverHandler } from './interface'
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

  const handleClose = (event: MouseEvent<T>) => {
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
  useEffect(() => {
    if (current) {
      current.onloadedmetadata = () => {
        setDuration(current.duration)
      }
    }

    return () => {
      if (current) {
        current.onloadedmetadata = null
      }
    }
  }, [playUrl])

  return duration
}

type SongPosition = [
  position: number,
  setSongPosition: (songPosition: number) => void
]

export function useSongPosition(
  current: HTMLAudioElement | null,
  playUrl: string
): SongPosition {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (current) {
      current.ontimeupdate = () => {
        setPosition(Math.floor(current.currentTime))
      }
    }

    return () => {
      if (current) {
        current.ontimeupdate = null
      }
    }
  }, [playUrl])

  const setSongPosition = (songPosition: number) => {
    if (current && current.readyState > 2) {
      setPosition(songPosition)
      current.currentTime = Math.floor(songPosition)
    }
  }

  return [position, setSongPosition]
}
