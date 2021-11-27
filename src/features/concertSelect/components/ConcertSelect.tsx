import { Autocomplete } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { background } from '../../../app/background'
import ConcertTextField from './ConcertTextField'
import {
  InputChangeHandler,
  InputClearHandler,
  ConcertSelectProps,
} from '../concertSelectInterface'
import { SxProps } from '@mui/system'

const autocompleteStyles: SxProps = {
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
  disabled,
}: ConcertSelectProps): JSX.Element {
  // Handle band / year select
  const handleChange: InputChangeHandler = (event, newValue) => {
    if (newValue) changeHandler(newValue.label)
  }

  // Handle clearing form
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
      value={value ? { label: value } : null}
      options={autocompleteOptions}
      disabled={disabled}
      sx={autocompleteStyles}
      onChange={handleChange}
      onInputChange={handleClearInput}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      popupIcon={<ExpandMoreIcon color="primary" />}
      renderInput={(params) => (
        <ConcertTextField {...params} placeholder={placeholder} />
      )}
    />
  )
}
