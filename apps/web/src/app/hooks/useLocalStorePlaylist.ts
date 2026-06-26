import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { PlaylistTrack } from '../../features'
import { useAppDispatch } from './useRedux'
import {
  setPlayerState,
  setPlaylist,
  setUsePlaylist,
} from '../../features/selectedConcert/selectedConcertSlice'
import { PlayerState } from '../interface'

function subscribeToEvent(cb: () => void): () => void {
  window?.addEventListener('storage', cb)
  return () => {
    window?.removeEventListener('storage', cb)
  }
}

function getServerSnapshot(defaultValue: string): () => string {
  return () => defaultValue
}

function parsePlaylist(list: string, defaultValue: string) {
  return list !== defaultValue ? JSON.parse(list) : []
}

export function useLocalStorePlaylist(key: string, defaultValue: string) {
  const dispatch = useAppDispatch()
  const valueFromStorage = useCallback(() => {
    try {
      const playlist = localStorage.getItem(key)
      if (!playlist) return defaultValue
      return playlist
    } catch {
      return defaultValue
    }
  }, [key, defaultValue])

  const setValue = useCallback(
    (value: (prevList: PlaylistTrack[]) => PlaylistTrack[]) => {
      try {
        const playlist = localStorage.getItem(key) || defaultValue
        const parseList = parsePlaylist(playlist, defaultValue)

        localStorage.setItem(key, JSON.stringify(value(parseList)))
        window.dispatchEvent(new Event('storage'))
      } catch {
        return
      }
    },
    [key]
  )

  const value = useSyncExternalStore(
    subscribeToEvent,
    valueFromStorage,
    getServerSnapshot(defaultValue)
  )

  useEffect(() => {
    const formattedValue = parsePlaylist(value, defaultValue)

    dispatch(setPlaylist(formattedValue))

    if (!formattedValue?.length) {
      dispatch(setUsePlaylist(false))
      dispatch(setPlayerState(PlayerState.Pause))
    }
  }, [value])

  return [parsePlaylist(value, defaultValue), setValue]
}
