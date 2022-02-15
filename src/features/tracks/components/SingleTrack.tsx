import {
  // Checkbox,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { background } from '../../../app/background'
import { durationFormat } from '../../../app/util'

const listItemStyles: SxProps = {
  background,
  margin: '10px 0',
  // padding: '7px 16px',
  // border: '2px solid white',
  textTransform: 'capitalize',
}

const listItemTextSyles: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  '& span': {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  '& p': {
    color: '#1c1d20',
    alignSelf: 'end',
    marginRight: '10px',
  },
}

interface SingleTrackProps {
  name: string
  title: string
  length: string
  currentTrackName: string
  playNewTrack: (name: string) => void
}

export default function SingleTrack({
  name,
  title,
  playNewTrack,
  currentTrackName,
  length,
}: SingleTrackProps): JSX.Element {
  const duration = (durationValue: string): string => {
    // Value is already formatted
    if (durationValue.includes(':')) {
      return durationValue
    }
    // Value needs formatting
    const [calcMinutes, calcSecondsLeft, addZero] = durationFormat(
      parseInt(durationValue, 10)
    )
    return `${addZero(calcMinutes)}:${addZero(calcSecondsLeft)}`
  }
  return (
    <ListItemButton
      dense
      key={name}
      sx={listItemStyles}
      selected={currentTrackName === name}
    >
      <ListItemText
        sx={listItemTextSyles}
        id={title}
        primary={title || name}
        secondary={
          <>
            <Typography component="span" variant="body2">
              {length ? duration(length) : null}
            </Typography>
          </>
        }
        onClick={() => playNewTrack(name)}
      />
    </ListItemButton>
  )
}
