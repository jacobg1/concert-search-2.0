import { useRef, useState } from 'react'
import { CircularProgress, Drawer, Stack, Box } from '@mui/material'
import { SxProps } from '@mui/system'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import {
  useAppDispatch,
  useAppSelector,
  useAudioContext,
  useSongPosition,
} from '../../app/hooks'
import TrackListDisplay from '../tracks/TrackListDisplay'
import ConcertMeta from '../tracks/components/ConcertMeta'
import AudioPlayer from '../player/AudioPlayer'
import { AudioElement } from '../player/components/AudioElement'
import {
  playNextTrack,
  playPreviousTrack,
  playNewTrack,
} from './selectedConcertSlice'
import { TrackDirection } from '../../app/interface'
import { ButtonContainer } from './components/ButtonContainer'
import Visualizer from '../visualizer/Visualizer'

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

export default function SelectedConcertDisplay(): JSX.Element {
  const {
    loading,
    playerState,
    isDrawerOpen,
    currentlyPlayingTrack: { playUrl, currentTrackName },
    selectedConcert: { trackList, metadata },
  } = useAppSelector((state) => state.individualConcert)
  const dispatch = useAppDispatch()

  const [isVisualizerOpen, toggleVisualizer] = useState(false)
  const audioEl = useRef<HTMLAudioElement>(null)
  const [dataArray, audioBufferLength, analyser] = useAudioContext(
    audioEl.current
  )
  const [position, setSongPosition, resetSongPosition] = useSongPosition(
    audioEl.current,
    playUrl,
    playerState
  )

  const handlePlayNewTrack = (name: string): void => {
    const { current } = audioEl
    if (current) {
      if (!playUrl) toggleVisualizer(true)
      resetSongPosition()
      dispatch(playNewTrack(name))
    }
  }

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
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '90%',
                }}
              >
                <ConcertMeta
                  {...metadata}
                  numTracks={trackList.length.toString()}
                />
                <BarChartSharpIcon
                  style={{ color: 'white', cursor: 'pointer' }}
                  fontSize="large"
                  onClick={() => toggleVisualizer(!isVisualizerOpen)}
                />
              </Box>
            )}

            {trackList.length ? (
              <>
                {isVisualizerOpen && (
                  <Visualizer
                    dataArray={dataArray}
                    audioBufferLength={audioBufferLength}
                    analyser={analyser}
                  />
                )}
                <TrackListDisplay
                  trackList={trackList}
                  currentTrackName={currentTrackName}
                  playNewTrack={handlePlayNewTrack}
                />
                <AudioElement
                  ref={audioEl}
                  src={playUrl}
                  handleNextTrack={handleNextOrPreviousTrack(Next)}
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
