import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { setPlayerState } from '../../features/selectedConcert/selectedConcertSlice'
import { PlayerState, SessionState, SongPositionHandler } from '../interface'
import { useAppDispatch } from './useRedux'

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
  resetSongPosition: () => void,
  connectionError: string,
  setConnectionError: Dispatch<SetStateAction<string>>
]

export function useSongPosition(
  current: HTMLAudioElement | null,
  playUrl: string,
  playerState: string
): SongPosition {
  const dispatch = useAppDispatch()
  const [position, setPosition] = useState(0)
  const [connectionError, setConnectionError] = useState('')

  if (current) {
    // If media stalls pause for a few seconds and attempt to replay
    current.onstalled = () => {
      if (playUrl && !current.paused) {
        current.pause()
        dispatch(setPlayerState(PlayerState.Pause))
        window.setTimeout(() => {
          current.play()
          dispatch(setPlayerState(PlayerState.Play))
        }, 4000)
      }
    }

    current.ontimeupdate = () => {
      if (current.played) {
        setPosition(Math.floor(current.currentTime))
      }
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

  return [
    position,
    setSongPosition,
    resetSongPosition,
    connectionError,
    setConnectionError,
  ]
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
