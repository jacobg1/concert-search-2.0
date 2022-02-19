import {
  playNextTrack,
  playPreviousTrack,
} from '../features/selectedConcert/selectedConcertSlice'
import { AppDispatch } from './store'

type MediaSessionAction =
  | 'hangup'
  | 'nexttrack'
  | 'pause'
  | 'play'
  | 'previoustrack'
  | 'seekbackward'
  | 'seekforward'
  | 'seekto'
  | 'skipad'
  | 'stop'
  | 'togglecamera'
  | 'togglemicrophone'

interface MediaHandler {
  action: MediaSessionAction
  handler: () => void | null
}

export const mediaHandlers = (
  current: HTMLMediaElement,
  dispatch: AppDispatch
): MediaHandler[] => {
  return [
    {
      action: 'play',
      handler: () => {
        current.play()
        navigator.mediaSession.playbackState = 'playing'
      },
    },
    {
      action: 'pause',
      handler: () => {
        current.pause()
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
