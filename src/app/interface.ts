import { Dispatch, SetStateAction, MouseEvent } from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type PopoverHandler<T> = (event: MouseEvent<T>) => void

export type VolumeChangeHandler = (
  event: Event,
  newValue: number | number[]
) => void

export type SongPositionHandler = (songPosition: number) => void
