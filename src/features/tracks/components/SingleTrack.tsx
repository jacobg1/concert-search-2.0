import {
  ListItemButton,
  ListItemText,
  Typography,
  type SxProps,
} from '@mui/material'
import { background } from '../../../app/background'
import { handleTrackDuration } from '../../../app/util'
import { SingleTrackProps } from '../trackInterface'
import { PlayingText } from './PlayingText'

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
    fontWeight: 700,
  },
  '& p': {
    color: '#1c1d20',
    alignSelf: 'end',
    marginRight: '10px',
  },
}

const songDurationContainer: SxProps = {
  display: 'flex',
  alignItems: 'center',
  '& .playing': {
    fontWeight: 700,
    marginRight: { xs: '15px', md: '40px' },
  },
}

export default function SingleTrack({
  name,
  title,
  playNewTrack,
  currentTrackName,
  length,
}: SingleTrackProps): JSX.Element {
  const isSelectedTrack = currentTrackName === name
  return (
    <ListItemButton
      dense
      key={name}
      sx={listItemStyles}
      selected={isSelectedTrack}
    >
      <ListItemText
        sx={listItemTextSyles}
        id={name}
        primary={title || name}
        slotProps={{
          secondary: {
            component: 'div',
            sx: songDurationContainer,
          },
        }}
        secondary={
          <>
            {isSelectedTrack && <PlayingText />}
            <Typography component="span" variant="subtitle2">
              {length ?? handleTrackDuration(length)}
            </Typography>
          </>
        }
        onClick={() => playNewTrack(name)}
      />
    </ListItemButton>
  )
}
