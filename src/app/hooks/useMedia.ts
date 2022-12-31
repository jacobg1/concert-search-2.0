import { useEffect } from 'react'
import {
  TrackMetadata,
  TrackListData,
} from '../../features/tracks/trackInterface'

import { mediaHandlers } from '../mediaHandlers'
import { useAppDispatch } from './useRedux'

export function useMediaSession(
  metadata: TrackMetadata | null,
  trackList: TrackListData[],
  currentTrackName: string
) {
  useEffect(() => {
    if (metadata && 'mediaSession' in navigator) {
      const findTitle = trackList.find(({ name }) => currentTrackName === name)

      navigator.mediaSession.metadata = new MediaMetadata({
        title: findTitle ? findTitle.title : currentTrackName,
        artist: metadata.creator,
        album: metadata.title,
      })
    }
  }, [metadata, currentTrackName])
}

export function useMediaHandlers(current: HTMLAudioElement) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if ('mediaSession' in navigator) {
      mediaHandlers(current, dispatch).forEach(({ action, handler }) =>
        navigator.mediaSession.setActionHandler(action, handler)
      )
    }
  }, [])
}
