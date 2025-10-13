import { SelectChangeEvent } from '@mui/material'

export type SelectEvent = SelectChangeEvent<{ label: string } | null>

export interface ConcertSelectProps {
  id: string
  placeholder: string
  value: string
  disabled: boolean
  autocompleteOptions: { label: string }[]
  changeHandler: (selection: string) => void
  clearSelection: () => void
}

export interface ConcertSelectState {
  bandList: Record<string, string[]> | null
  selectedBand: string
  selectedYear: string
  filterDuplicates: boolean
}
