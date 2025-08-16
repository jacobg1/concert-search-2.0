import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  type SxProps,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
  '&:hover': {
    backgroundColor: '#3e95a1',
  },
  '&.Mui-selected': {
    backgroundColor: '#3e95a1',
    '&:hover, &:focus': {
      backgroundColor: '#3e95a1',
    },
  },
  '&:focus': {
    backgroundColor: '#2e7e89',
    '&:hover': {
      backgroundColor: '#3e95a1',
    },
  },
}

const iconContainerStyles: SxProps = {
  width: { xs: '90px', sm: '75px' },
  display: 'flex',
  alignItems: 'center',
}

const closeIconStyles: SxProps = {
  cursor: 'pointer',
  fontSize: { xs: '13px', sm: '15px' },
  stroke: '#2e7e89',
  strokeWidth: '1.5px',
  padding: '5px',
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
  clearSelection,
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
        <Box sx={iconContainerStyles}>
          {value ? (
            <CloseIcon
              color="primary"
              sx={closeIconStyles}
              onClick={clearSelection}
            />
          ) : null}
          <ExpandMoreIcon
            className={props.className}
            color="primary"
            style={{ marginRight: '5px' }}
          />
        </Box>
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
