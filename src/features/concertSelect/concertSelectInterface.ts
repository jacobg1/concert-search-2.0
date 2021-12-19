import { SelectChangeEvent } from '@mui/material'

export type SelectEvent = SelectChangeEvent<{ label: string } | null>

export interface ConcertSelectProps {
  id: string
  placeholder: string
  value: string
  disabled: boolean
  autocompleteOptions: { label: string }[]
  changeHandler: (selection: string) => void
}

export interface ConcertSelectButtonProps {
  selectedBand: string
  selectedYear: string
}
