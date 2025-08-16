import {
  MenuItem,
  Select,
  SelectChangeEvent,
  type SxProps,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { background } from '../../../app/background'
import { ConcertSelectProps } from '../concertSelectInterface'

const selectListStyles: SxProps = {
  '&.MuiOutlinedInput-root': {
    borderRadius: '0px',
    border: 'none',
    color: 'black',
    marginBottom: '20px',
    background,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-icon': {
    transition: 'transform .2s ease-in-out',
    fill: 'rgb(46, 126, 137)',
  },
  '& .MuiSelect-iconOpen': {
    transform: 'rotate(180deg)',
  },
}

const menuItemStyles: SxProps = {
  height: '48px',
  '& input': {
    fontWeight: 'bold',
    '&::placeholder': {
      opacity: 1,
    },
    '&::selection': {
      background: 'none',
    },
  },
  '&:hover, &.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: '#3e95a1',
  },
  '&:focus': {
    backgroundColor: '#2e7e89',
    '&:hover': {
      backgroundColor: '#3e95a1',
    },
  },
}

const MenuProps = {
  PaperProps: {
    style: {
      maxWidth: '900px',
      maxHeight: 250,
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
  value,
  disabled,
}: ConcertSelectProps): JSX.Element {
  return (
    <Select
      id={id}
      value={value}
      disabled={disabled}
      displayEmpty
      sx={selectListStyles}
      MenuProps={MenuProps}
      inputProps={{ id: `${id}-input` }}
      autoFocus={false}
      IconComponent={(props) => (
        <ExpandMoreIcon
          className={props.className}
          color="primary"
          style={{ position: 'absolute', right: '15px' }}
        />
      )}
      onChange={(event: SelectChangeEvent) => changeHandler(event.target.value)}
      renderValue={(selected) => (!selected.length ? placeholder : selected)}
    >
      <MenuItem id={`${id}-placeholder`} disabled value="">
        {placeholder}
      </MenuItem>
      {autocompleteOptions.map(({ label }) => (
        <MenuItem
          id={`${id}-${label}`}
          key={label}
          value={label}
          sx={menuItemStyles}
        >
          {label}
        </MenuItem>
      ))}
    </Select>
  )
}
