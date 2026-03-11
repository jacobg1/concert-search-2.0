import type { UnknownAction } from '@reduxjs/toolkit'
import type { TrackListData } from '../features/tracks/trackInterface'
import { MediaFormat, type NetworkError, type BandList, PlayerState, TrackDirection } from './interface'
import type { AppDispatch, AppThunk } from './store'
import type { RefObject } from 'react'
import {
  setConcertInitialized,
  playNewTrack,
  setPlayerState,
  playNextTrack,
  playPreviousTrack
} from '../features/selectedConcert/selectedConcertSlice'

function durationFormat(
  durationValue: number
): [number, number, (x: number) => string] {
  const calcMinutes = Math.floor(durationValue / 60)
  const calcSecondsLeft = Math.floor(durationValue - calcMinutes * 60)

  const addZero = (time: number): string => {
    return time <= 9 ? `0${time}` : `${time}`
  }

  return [calcMinutes, calcSecondsLeft, addZero]
}

export function handleTrackDuration(durationValue: string): string {
  // Value is already formatted
  if (durationValue.includes(':')) {
    return durationValue
  }
  // Value needs formatting
  const [calcMinutes, calcSecondsLeft, addZero] = durationFormat(
    parseInt(durationValue, 10)
  )
  return `${addZero(calcMinutes)}:${addZero(calcSecondsLeft)}`
}

export function handleTrackProgressDuration(
  durationValue: number
): string {
  const [calcMinutes, calcSecondsLeft, addZero] =
    durationFormat(durationValue)

  return `${calcMinutes}:${addZero(calcSecondsLeft)}`
}

export function filterHTMLText(text?: string): string {
  if (!text) return ''

  try {
    const exp = /(<([^>]+)>)/gi
    return text.replace(exp, '')
  } catch {
    return text
  }
}

const formatter = (array: string[]) => array.map((x) => ({ label: x }))

export function getBandOptions(bandList: BandList) {
  if (!bandList) return []
  return formatter(Object.keys(bandList))
}

export function getYearOptions(bandList: BandList, selectedBand?: string) {
  if (!bandList || !selectedBand) return []
  return formatter(bandList[selectedBand])
}

export function findTrackIndex(
  trackList: TrackListData[],
  currentTrackName: string
): number {
  return trackList.findIndex(({ name }) => name === currentTrackName)
}

export function findPreviousTrack(
  trackList: TrackListData[],
  trackIndex: number,
  currentTrackName?: string
): TrackListData {
  if (!currentTrackName) return trackList[0]

  const isFirstTrack = trackIndex === 0

  if (isFirstTrack) {
    return trackList[trackList.length - 1]
  }

  return trackList[trackIndex - 1]
}

export function findNextTrack(
  trackList: TrackListData[],
  trackIndex: number,
  currentTrackName?: string
): TrackListData {
  if (!currentTrackName) return trackList[0]

  const isLastTrack = trackIndex === trackList.length - 1

  if (isLastTrack) return trackList[0]

  return trackList[trackIndex + 1]
}

export function findNewTrack(
  trackList: TrackListData[],
  currentTrackName?: string
): TrackListData {
  if (!currentTrackName) return trackList[0]

  const trackIndex = findTrackIndex(trackList, currentTrackName)

  return trackList[trackIndex]
}

// Replace file extension with currently selected media format
export const addSongFormat = (
  src: string,
  format: MediaFormat
): string => {
  return src.replace(/\.[^/.]+$/, `.${format}`)
}

export function hasNetworkError(
  listError: NetworkError | Record<string, never>,
  concertError: NetworkError | Record<string, never>
): boolean {
  return (
    (listError && Object.keys(listError).length !== 0) ||
    (concertError && Object.keys(concertError).length !== 0)
  )
}

export function withDispatch(
  dispatch: AppDispatch,
  cb: (...args: string[]) => UnknownAction | AppThunk
) {
  return (selection?: string) => {
    return dispatch(selection ? cb(selection) : cb())
  }
}

export function isPlaying(el: RefObject<HTMLAudioElement>): boolean {
  if (!el.current) return false
  return !!(
    el.current.currentTime > 0 &&
    !el.current.paused &&
    !el.current.ended &&
    el.current.readyState > 2
  )
}

export function onPlayPauseClick(
  dispatch: AppDispatch,
  audioElement: RefObject<HTMLAudioElement>,
  playUrl?: string
): void {
  if (!audioElement.current) return

  if (!playUrl) {
    dispatch(setConcertInitialized())
    dispatch(playNewTrack())
    return
  }

  if (!isPlaying(audioElement)) {
    dispatch(setPlayerState(PlayerState.Play))
  } else {
    dispatch(setPlayerState(PlayerState.Pause))
  }
}

export function handleNextOrPreviousTrack(
  dispatch: AppDispatch,
  audioElement: RefObject<HTMLAudioElement>,
  resetSongPosition: () => void,
) {
  return (nextOrPrev: TrackDirection): void => {
    if (!audioElement.current) return

    dispatch(setConcertInitialized())
    resetSongPosition()

    if (nextOrPrev === TrackDirection.Next) {
      dispatch(playNextTrack())
    } else {
      dispatch(playPreviousTrack())
    }
  }
}

export function handlePlayNewTrack(
  dispatch: AppDispatch,
  audioElement: RefObject<HTMLAudioElement>,
  resetSongPosition: () => void
) {
  return (name: string) => {
    if (!audioElement.current) return

    dispatch(setConcertInitialized())
    resetSongPosition()
    dispatch(playNewTrack(name))
  }
}
