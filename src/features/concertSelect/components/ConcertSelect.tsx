import { Autocomplete, ClassNameMap } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { background } from '../../../app/background'
import ConcertTextField from './ConcertTextField'
import {
  InputChangeHandler,
  InputClearHandler,
  ConcertSelectProps,
} from '../concertSelectInterface'

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
  // Handle band / year select
  const handleChange: InputChangeHandler = (event, newValue) => {
    if (newValue) changeHandler(newValue.label)
  }

  // Handler clearing form
  const handleClearInput: InputClearHandler = (
    event,
    newInputValue,
    reason
  ) => {
    if (reason === 'clear') clearHandler()
  }

  return (
    <Autocomplete
      disablePortal
      id={id}
      value={{ label: value }}
      options={autocompleteOptions}
      sx={autocompleteStyles}
      onChange={handleChange}
      onInputChange={handleClearInput}
      popupIcon={<ExpandMoreIcon color="primary" />}
      renderInput={(params) => (
        <ConcertTextField {...params} placeholder={placeholder} />
      )}
    />
  )
}
