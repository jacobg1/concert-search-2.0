import { useState, MouseEvent, useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { PlayerState, PopoverHandler, SongPositionHandler } from './interface'
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

export function usePlayPause(
  current: HTMLAudioElement | null,
  playUrl: string,
  playerState: PlayerState
): void {
  useEffect(() => {
    if (!current) return

    if (playerState === Play) {
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
    if (current && current.readyState > 2) {
      // Pause track
      current.pause()

      // Set position and currentTime
      setPosition(songPosition)
      current.currentTime = Math.floor(songPosition)

      // Start track back up
      if (current.paused && playerState !== Pause) {
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

type SoundToggle = [isMuted: boolean, setIsMuted: () => void]

export function useToggleSound(current: HTMLAudioElement | null): SoundToggle {
  const { isDrawerOpen } = useAppSelector((state) => state.individualConcert)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!isDrawerOpen) setIsMuted(false)
  }, [isDrawerOpen])

  const handleToggleSound = () => {
    if (current) {
      const isPlayerMuted = !current.paused && !current.muted

      setIsMuted(isPlayerMuted)
      current.muted = isPlayerMuted
    }
  }
  return [isMuted, handleToggleSound]
}
