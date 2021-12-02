import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { SxProps } from '@mui/system'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { background } from '../../../app/background'
import { ConcertSelectProps } from '../concertSelectInterface'

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

const menuItemStyles: SxProps = {
  '& input': {
    fontWeight: 'bold',
    '&::placeholder': {
      opacity: 1,
    },
    '&::selection': {
      background: 'none',
    },
  },
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
      // width: 250,
      background: '#2e7e89',
      color: 'white',
      fontWeight: 'bold',
    },
  },
}
export default function ConcertSelect({
  id,
  placeholder,
  autocompleteOptions,
  changeHandler,
  // clearHandler,
  value,
  disabled,
}: ConcertSelectProps): JSX.Element {
  return (
    <Select
      id={id}
      value={value}
      disabled={disabled}
      displayEmpty
      sx={autocompleteStyles}
      MenuProps={MenuProps}
      IconComponent={() => (
        <ExpandMoreIcon
          style={{ position: 'absolute', right: '15px' }}
          color="primary"
        />
      )}
      onChange={(event: SelectChangeEvent) => changeHandler(event.target.value)}
      renderValue={(selected) => (!selected.length ? placeholder : selected)}
    >
      <MenuItem disabled value="">
        {placeholder}
      </MenuItem>
      {autocompleteOptions.map(({ label }) => (
        <MenuItem key={label} value={label} sx={menuItemStyles}>
          {label}
        </MenuItem>
      ))}
    </Select>
  )
}
