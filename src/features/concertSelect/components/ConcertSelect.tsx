import { Autocomplete, ClassNameMap } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { background } from '../../../app/background'
import { SyntheticEvent } from 'react'
import ConcertTextField from './ConcertTextField'

interface ConcertSelectProps {
  id: string
  placeholder: string
  autocompleteOptions: { label: string }[]
  changeHandler: (selection: string) => void
  clearHandler: () => void
  value: string
}

const autocompleteStyles: Record<string, ClassNameMap> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px',
    border: 'none',
    color: 'black',
    background,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}

export default function ConcertSelect({
  id,
  placeholder,
  autocompleteOptions,
  changeHandler,
  clearHandler,
  value,
}: ConcertSelectProps) {
  return (
    <Autocomplete
      disablePortal
      id={id}
      value={{ label: value }}
      options={autocompleteOptions}
      sx={autocompleteStyles}
      onChange={(event: SyntheticEvent, newValue: { label: string } | null) => {
        if (newValue) changeHandler(newValue.label)
      }}
      onInputChange={(
        event: SyntheticEvent,
        newInputValue: string,
        reason: string
      ) => {
        if (reason === 'clear') clearHandler()
      }}
      popupIcon={<ExpandMoreIcon color="primary" />}
      renderInput={(params) => (
        <ConcertTextField {...params} placeholder={placeholder} />
      )}
    />
  )
}
