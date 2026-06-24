import {
  Box,
  ListItemButton,
  ListItemText,
  Typography,
  type SxProps,
} from '@mui/material'
import { background } from '../../../app/background'
import { handleTrackDuration } from '../../../app/util'
import { SingleTrackProps } from '../trackInterface'
import { PlayingText } from './PlayingText'
import { PlaylistToggle } from './PlaylistToggle'

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

const playlistToggleContainer: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  width: { xs: '55px', sm: '75px' },
  flexDirection: 'row',
}

export default function SingleTrack({
  name,
  link,
  title,
  length,
  playlist,
  md5,
  setPlaylist,
  playNewTrack,
  currentTrackName,
}: SingleTrackProps): JSX.Element {
  const isSelectedTrack = currentTrackName === name

  return (
    <ListItemButton
      dense
      disableRipple
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
            <Box sx={playlistToggleContainer}>
              <PlaylistToggle
                md5={md5}
                add={!playlist.has(md5)}
                track={{ title, link, length }}
                setPlaylist={setPlaylist}
              />
              <Typography component="span" variant="subtitle2">
                {length ? handleTrackDuration(length) : null}
              </Typography>
            </Box>
          </>
        }
        onClick={() => playNewTrack(name)}
      />
    </ListItemButton>
  )
}
