import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react'
import { setPlayerState } from '../../features/selectedConcert/selectedConcertSlice'
import { PlayerState, SessionState, SongPositionHandler } from '../interface'
import { useAppDispatch } from './useRedux'

export function useSongDuration(
  audioEl: RefObject<HTMLAudioElement>,
  playUrl: string
): number {
  const [duration, setDuration] = useState(0)

  if (audioEl.current) {
    audioEl.current.onloadedmetadata = () => {
      setDuration(audioEl.current?.duration || 0)
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
  audioEl: RefObject<HTMLAudioElement>,
  playUrl: string,
  playerState: string
): SongPosition {
  const dispatch = useAppDispatch()
  const [position, setPosition] = useState(0)
  const [connectionError, setConnectionError] = useState('')

  if (audioEl.current) {
    // If media stalls pause for a few seconds and attempt to replay
    audioEl.current.onstalled = () => {
      if (playUrl && !audioEl.current?.paused) {
        audioEl.current?.pause()
        dispatch(setPlayerState(PlayerState.Pause))
        window.setTimeout(() => {
          audioEl.current?.play()
          dispatch(setPlayerState(PlayerState.Play))
        }, 4000)
      }
    }

    audioEl.current.ontimeupdate = () => {
      if (audioEl.current?.played) {
        setPosition(Math.floor(audioEl.current?.currentTime || 0))
      }
    }
  }

  useEffect(() => {
    if (!playUrl) setPosition(0)
  }, [playUrl])

  const setSongPosition = (songPosition: number) => {
    if (audioEl.current) {
      // Pause track
      audioEl.current.pause()
      setMediaSessionState(SessionState.Paused)

      // Set position and currentTime
      setPosition(songPosition)
      audioEl.current.currentTime = Math.floor(songPosition)

      // Start track back up
      if (audioEl.current.paused && playerState !== PlayerState.Pause) {
        audioEl.current
          .play()
          .then(() => setMediaSessionState(SessionState.Playing))
          .catch(() => setMediaSessionState(SessionState.Paused))
      }
    }
  }

  const resetSongPosition = () => {
    if (!audioEl.current) return
    setPosition(0)
    audioEl.current.currentTime = 0
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
  audioEl: RefObject<HTMLAudioElement>,
  playUrl: string,
  playerState: PlayerState
): void {
  useEffect(() => {
    if (!audioEl.current) return

    if (playerState === PlayerState.Play) {
      audioEl.current
        .play()
        .then(() => setMediaSessionState(SessionState.Playing))
        .catch(() => setMediaSessionState(SessionState.Paused))
    } else {
      audioEl.current.pause()
      setMediaSessionState(SessionState.Paused)
    }
  }, [playerState, playUrl])
}
