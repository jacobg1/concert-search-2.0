import {
  // Checkbox,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { background } from '../../../app/background'

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
  length,
  playNewTrack,
  currentTrackName,
}: SingleTrackProps): JSX.Element {
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
              {length}
            </Typography>
          </>
        }
        onClick={() => playNewTrack(name)}
      />
    </ListItemButton>
  )
}
