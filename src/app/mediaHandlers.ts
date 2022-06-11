import {
  playNextTrack,
  playPreviousTrack,
} from '../features/selectedConcert/selectedConcertSlice'
import { MediaHandler } from './interface'
import { AppDispatch } from './store'

export const mediaHandlers = (
  current: HTMLMediaElement,
  dispatch: AppDispatch
): MediaHandler[] => {
  return [
    {
      action: 'play',
      handler: () => {
        current
          .play()
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
