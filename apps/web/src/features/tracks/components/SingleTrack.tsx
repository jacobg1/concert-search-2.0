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
  textTransform: 'capitalize',
  display: 'flex',
  flexDirection: 'column',
}

const listItemTextSyles: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
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
    paddingRight: { xs: '15px', md: '40px' },
  },
}

const playlistToggleContainer: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  width: { xs: '55px', sm: '75px' },
  flexDirection: 'row',
}

export default function SingleTrack({
  album,
  creator,
  name,
  link,
  title,
  length,
  playlist,
  md5,
  showPlaylist,
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
      onClick={() => playNewTrack(name)}
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
                add={!playlist?.find((song) => song?.md5 === md5)}
                track={{ album, creator, md5, name, title, link, length }}
                setPlaylist={setPlaylist}
              />
              <Typography component="span" variant="subtitle2">
                {length ? handleTrackDuration(length) : null}
              </Typography>
            </Box>
          </>
        }
      />
      {showPlaylist ? (
        <Box
          onClick={() => playNewTrack(name)}
          style={{ alignSelf: 'flex-start' }}
        >
          <Typography style={{ paddingBottom: '5px', margin: 0 }}>
            {creator} - {album}
          </Typography>
        </Box>
      ) : null}
    </ListItemButton>
  )
}
