import { useRef } from 'react'
import {
  CircularProgress,
  Drawer,
  Stack,
  Box,
  Snackbar,
  IconButton,
  Typography,
  type SxProps,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp'

import TrackListDisplay from '../tracks/TrackListDisplay'
import ConcertMeta from '../tracks/components/ConcertMeta'
import AudioPlayer from '../player/AudioPlayer'
import { ButtonContainer } from './components/ButtonContainer'
import Visualizer from '../visualizer/Visualizer'
import { handlePlayNewTrack, handleNextOrPreviousTrack } from '../../app/util'
import {
  useAppSelector,
  useAppDispatch,
  useMediaSession,
  useSongPosition,
} from '../../app/hooks'

const drawerStyles: SxProps = {
  height: '100%',
  flexShrink: 0,
  zIndex: 0,
  '& .MuiDrawer-paper': {
    height: '100%',
    boxSizing: 'border-box',
    zIndex: 0,
    minWidth: '320px',
  },
  '& .MuiDrawer-paperAnchorBottom': {
    backgroundColor: '#2e7e89',
    overflow: 'auto',
  },
}

const stackStyles = {
  width: '100%',
  maxWidth: '1000px',
  alignItems: 'center',
  alignSelf: 'center',
}

const metadataStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '90%',
}

const snackbarStyles = {
  left: '18px',
  right: '15px',
  bottom: '24px',
  color: '#ffffff',
  width: '88%',
}

const snackbarBoxStyles: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '13px',
  backgroundColor: '#d32f2f',
  '& .MuiTypography-body1': {
    paddingLeft: '15px',
  },
  '& .MuiSvgIcon-root': {
    alignSelf: 'center',
    display: 'inline-block',
  },
}

export default function SelectedConcertDisplay(): JSX.Element {
  const {
    loading,
    playerState,
    isDrawerOpen,
    concertInitialized,
    currentlyPlayingTrack: { playUrl, currentTrackName },
    selectedConcert: { trackList, metadata },
  } = useAppSelector((state) => state.individualConcert)
  const dispatch = useAppDispatch()

  const audioEl = useRef<HTMLAudioElement>(null)

  const [
    position,
    setSongPosition,
    resetSongPosition,
    connectionError,
    setConnectionError,
  ] = useSongPosition(audioEl, playUrl, playerState)

  useMediaSession(metadata, trackList, currentTrackName)

  const nextOrPrevTrack = handleNextOrPreviousTrack(dispatch, audioEl, resetSongPosition)
  const playNewTrack = handlePlayNewTrack(dispatch, audioEl, resetSongPosition)

  return (
    <Drawer
      sx={drawerStyles}
      variant="persistent"
      anchor="bottom"
      open={isDrawerOpen}
      hideBackdrop
      transitionDuration={0}
    >
      <Stack style={stackStyles}>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <>
            <ButtonContainer />
            {metadata && (
              <Box style={metadataStyles}>
                <ConcertMeta
                  {...metadata}
                  numTracks={trackList.length.toString()}
                />
              </Box>
            )}
            {audioEl.current && (
              <Visualizer
                audioEl={audioEl}
                concertInitialized={concertInitialized}
              />
            )}
            {trackList.length ? (
              <>
                <TrackListDisplay
                  trackList={trackList}
                  currentTrackName={currentTrackName}
                  playNewTrack={playNewTrack}
                />
                <AudioPlayer
                  audioEl={audioEl}
                  playUrl={playUrl}
                  playerState={playerState}
                  position={position}
                  setSongPosition={setSongPosition}
                  nextOrPrevTrack={nextOrPrevTrack}
                />
              </>
            ) : null}
          </>
        )}
      </Stack>
      <Snackbar
        open={!!connectionError}
        hidden={!connectionError}
        autoHideDuration={4000}
        slotProps={{ transition: { appear: false } }}
        onClose={() => setConnectionError('')}
        message={connectionError}
        sx={snackbarStyles}
      >
        <Box sx={snackbarBoxStyles}>
          <Box display="inline-flex">
            <ErrorOutlineSharpIcon fontSize="medium" />
            <Typography>{connectionError}</Typography>
          </Box>
          <IconButton
            size="medium"
            aria-label="close"
            color="inherit"
            onClick={() => setConnectionError('')}
          >
            <CloseIcon color="inherit" fontSize="medium" />
          </IconButton>
        </Box>
      </Snackbar>
    </Drawer>
  )
}
