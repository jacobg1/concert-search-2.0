import { useRef } from 'react'
import { CircularProgress, Drawer, Stack, Box } from '@mui/material'
import { SxProps } from '@mui/system'
import TrackListDisplay from '../tracks/TrackListDisplay'
import ConcertMeta from '../tracks/components/ConcertMeta'
import AudioPlayer from '../player/AudioPlayer'
import {
  playNextTrack,
  playPreviousTrack,
  playNewTrack,
} from './selectedConcertSlice'
import { TrackDirection } from '../../app/interface'
import { ButtonContainer } from './components/ButtonContainer'
import Visualizer from '../visualizer/Visualizer'
import {
  useAppSelector,
  useAppDispatch,
  useMediaSession,
  useSongPosition,
} from '../../app/hooks'

const { Next, Prev } = TrackDirection

const drawerStyles: SxProps = {
  height: '100%',
  flexShrink: 0,
  zIndex: 0,
  '& .MuiDrawer-paper': {
    height: '100%',
    boxSizing: 'border-box',
    zIndex: 0,
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

export default function SelectedConcertDisplay(): JSX.Element {
  const {
    loading,
    playerState,
    isDrawerOpen,
    currentlyPlayingTrack: { playUrl, currentTrackName },
    selectedConcert: { trackList, metadata },
  } = useAppSelector((state) => state.individualConcert)
  const dispatch = useAppDispatch()

  const audioEl = useRef<HTMLAudioElement>(null)

  const [position, setSongPosition, resetSongPosition] = useSongPosition(
    audioEl.current,
    playUrl,
    playerState
  )

  useMediaSession(metadata, trackList, currentTrackName)

  const handleNextOrPreviousTrack =
    (nextOrPrev: TrackDirection) => (): void => {
      const { current } = audioEl
      if (!current) return

      resetSongPosition()
      if (nextOrPrev === Next) {
        dispatch(playNextTrack())
      } else {
        dispatch(playPreviousTrack())
      }
    }

  const handlePlayNewTrack = (name: string): void => {
    const { current } = audioEl
    if (current) {
      resetSongPosition()
      dispatch(playNewTrack(name))
    }
  }
  return (
    <Drawer
      sx={drawerStyles}
      variant="persistent"
      anchor="bottom"
      open={isDrawerOpen}
      hideBackdrop
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
            {audioEl.current && <Visualizer current={audioEl.current} />}
            {trackList.length ? (
              <>
                <TrackListDisplay
                  trackList={trackList}
                  currentTrackName={currentTrackName}
                  playNewTrack={handlePlayNewTrack}
                />
                <AudioPlayer
                  audioEl={audioEl}
                  playUrl={playUrl}
                  playerState={playerState}
                  position={position}
                  setSongPosition={setSongPosition}
                  handleNextTrack={handleNextOrPreviousTrack(Next)}
                  handlePreviousTrack={handleNextOrPreviousTrack(Prev)}
                />
              </>
            ) : null}
          </>
        )}
      </Stack>
    </Drawer>
  )
}
