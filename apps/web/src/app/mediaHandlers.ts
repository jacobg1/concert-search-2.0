import { RefObject } from 'react'
import {
  playNextTrack,
  playPreviousTrack,
} from '../features/selectedConcert/selectedConcertSlice'
import { MediaHandler } from './interface'
import { AppDispatch } from './store'

export const mediaHandlers = (
  audioEl: RefObject<HTMLMediaElement>,
  dispatch: AppDispatch
): MediaHandler[] => {
  if (!audioEl.current) return []
  return [
    {
      action: 'play',
      handler: () => {
        audioEl.current
          ?.play()
          .then(() => {
            navigator.mediaSession.playbackState = 'playing'
          })
          .catch(() => {
            navigator.mediaSession.playbackState = 'paused'
          })
      },
    },
    {
      action: 'pause',
      handler: () => {
        audioEl.current?.pause()
        navigator.mediaSession.playbackState = 'paused'
      },
    },
    {
      action: 'previoustrack',
      handler: () => {
        dispatch(playPreviousTrack())
      },
    },
    {
      action: 'nexttrack',
      handler: () => {
        dispatch(playNextTrack())
      },
    },
  ]
}
