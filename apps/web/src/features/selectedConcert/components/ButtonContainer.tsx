import { Box, type SxProps, Typography } from '@mui/material'
import { IconDirection } from '../../../app/interface'
import SongFormatSelect from '../../tracks/components/SongFormatSelect'
import { BackButton } from './BackButton'
import { useAppDispatch } from '../../../app/hooks'
import { setShowPlaylist } from '../selectedConcertSlice'
import type { PlaylistTrack } from '../../tracks'

const selectorStyles: SxProps = {
  alignSelf: 'center',
  '& span': {
    color: '#ffffff',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
}

const activeStyles: SxProps = {
  fontWeight: 600,
  textDecoration: 'underline',
}

export function ButtonContainer({
  showPlaylist,
  playlist,
}: {
  showPlaylist: boolean
  playlist?: PlaylistTrack[]
}): JSX.Element {
  const dispatch = useAppDispatch()

  const tracklistSelected = !showPlaylist ? activeStyles : {}
  const playlistSelected = showPlaylist ? activeStyles : {}

  return (
    <Box
      style={{
        width: '90%',
        margin: '30px auto 20px',
        display: 'flex',
        justifyContent: 'space-between',
        // alignItems: 'center',
      }}
    >
      <BackButton iconDirection={IconDirection.Left} />
      {playlist?.length ? (
        <Box
          sx={selectorStyles}
          onClick={() => {
            dispatch(setShowPlaylist(!showPlaylist))
          }}
        >
          <Typography sx={tracklistSelected} component="span">
            Tracklist
          </Typography>
          <Typography component="span"> / </Typography>
          <Typography sx={playlistSelected} component="span">
            Playlist
          </Typography>
        </Box>
      ) : null}
      <SongFormatSelect />
    </Box>
  )
}
