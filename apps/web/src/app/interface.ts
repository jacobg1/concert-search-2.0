import { Dispatch, SetStateAction, MouseEvent, RefObject } from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type PopoverHandler<T> = (event: MouseEvent<T>) => void

export type VolumeChangeHandler = (
  event: Event,
  newValue: number | number[]
) => void

export type SongPositionHandler = (songPosition: number) => void

export type AudioRef = RefObject<HTMLAudioElement>

export enum IconDirection {
  Left = 'left',
  Right = 'right',
}

export enum PlayerState {
  Play = 'play',
  Pause = 'pause',
}

export enum SessionState {
  Playing = 'playing',
  Paused = 'paused',
}

export enum TrackDirection {
  Next = 'next',
  Prev = 'prev',
}

export interface NetworkError {
  statusCode: number
  message: string
  error: string | Error
}

export enum MediaFormat {
  MP3 = 'mp3',
  OGG = 'ogg',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface MediaHandler {
  action: MediaSessionAction
  handler: () => void
}

export type BandList = Record<string, string[]> | null
