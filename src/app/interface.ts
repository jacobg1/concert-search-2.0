import { Dispatch, SetStateAction, MouseEvent } from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type PopoverHandler<T> = (event: MouseEvent<T>) => void
