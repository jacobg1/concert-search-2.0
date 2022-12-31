import { useEffect, useState } from 'react'
import { PlayerState, SessionState, SongPositionHandler } from '../interface'

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
      setMediaSessionState(SessionState.Paused)

      // Set position and currentTime
      setPosition(songPosition)
      current.currentTime = Math.floor(songPosition)

      // Start track back up
      if (current.paused && playerState !== PlayerState.Pause) {
        current
          .play()
          .then(() => setMediaSessionState(SessionState.Playing))
          .catch(() => setMediaSessionState(SessionState.Paused))
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

const setMediaSessionState = (sessionState: SessionState) => {
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

    if (playerState === PlayerState.Play) {
      current
        .play()
        .then(() => setMediaSessionState(SessionState.Playing))
        .catch(() => setMediaSessionState(SessionState.Paused))
    } else {
      current.pause()
      setMediaSessionState(SessionState.Paused)
    }
  }, [playerState, playUrl])
}
