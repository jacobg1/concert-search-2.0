import type { TrackListData } from '../features/tracks/trackInterface'
import { MediaFormat, type NetworkError, type BandList } from './interface'

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

export function handleTrackProgressDuration(durationValue: number): string {
  const [calcMinutes, calcSecondsLeft, addZero] = durationFormat(durationValue)

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
export const addSongFormat = (src: string, format: MediaFormat): string => {
  return src.replace(/\.[^/.]+$/, `.${format}`)
}

export function getIsOpen(
  listError: NetworkError | Record<string, never>,
  concertError: NetworkError | Record<string, never>
): boolean {
  return (
    (listError && Object.keys(listError).length !== 0) ||
    (concertError && Object.keys(concertError).length !== 0)
  )
}
