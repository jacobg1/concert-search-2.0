import { Box, type SxProps, Typography } from '@mui/material'
import { IconDirection } from '../../../app/interface'
import SongFormatSelect from '../../tracks/components/SongFormatSelect'
import { BackButton } from './BackButton'
import { useAppDispatch } from '../../../app/hooks'
import { setShowPlaylist } from '../selectedConcertSlice'
import { ButtonContainerProps } from '../interface'

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
  tracklist,
}: ButtonContainerProps): JSX.Element {
  const dispatch = useAppDispatch()

  const tracklistSelected = !showPlaylist ? activeStyles : {}
  const playlistSelected = showPlaylist ? activeStyles : {}

  const hasTracklist = tracklist?.length
  const hasPlaylist = playlist?.length

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
      <BackButton
        hasTracklist={tracklist?.length}
        iconDirection={IconDirection.Left}
      />
      <Box sx={selectorStyles}>
        {hasPlaylist && hasTracklist ? (
          <>
            <Typography
              onClick={() => {
                dispatch(setShowPlaylist(false))
              }}
              sx={tracklistSelected}
              component="span"
            >
              Tracklist
            </Typography>
            <Typography component="span"> / </Typography>
          </>
        ) : null}
        {hasPlaylist ? (
          <Typography
            onClick={() => {
              dispatch(setShowPlaylist(true))
            }}
            sx={playlistSelected}
            component="span"
          >
            Playlist
          </Typography>
        ) : null}
      </Box>
      <SongFormatSelect />
    </Box>
  )
}
