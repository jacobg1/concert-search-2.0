import { SelectChangeEvent } from '@mui/material'
import { SyntheticEvent } from 'react'

export type SelectEvent = SelectChangeEvent<{ label: string } | null>

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
  disabled: boolean
}

export interface ConcertSelectButtonProps {
  selectedBand: string
  selectedYear: string
}
