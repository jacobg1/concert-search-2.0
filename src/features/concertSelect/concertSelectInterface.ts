import { SyntheticEvent } from 'react'

export type InputChangeHandler = (
  event: SyntheticEvent,
  newValue: { label: string } | null
) => void

export type InputClearHandler = (
  event: SyntheticEvent,
  newInputValue: string,
  reason: string
) => void

export interface ConcertSelectProps {
  id: string
  placeholder: string
  autocompleteOptions: { label: string }[]
  changeHandler: (selection: string) => void
  clearHandler: () => void
  value: string
}
