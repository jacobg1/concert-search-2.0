import { useState, MouseEvent, useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type PopoverHandler<T> = (event: MouseEvent<T>) => void

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
