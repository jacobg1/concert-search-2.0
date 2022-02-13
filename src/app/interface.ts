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

export enum TrackDirection {
  Next = 'next',
  Prev = 'prev',
}

export interface NetworkError {
  statusCode: number
  message: string
  error: string | Error
}
