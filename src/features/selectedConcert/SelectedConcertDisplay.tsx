import { useRef } from 'react'
import { CircularProgress, Drawer, Stack } from '@mui/material'
import { SxProps } from '@mui/system'
import {
  useAppDispatch,
  useAppSelector,
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
    selectedConcert: { trackList, metaData },
  } = useAppSelector((state) => state.individualConcert)
  const dispatch = useAppDispatch()

  const audioEl = useRef<HTMLAudioElement>(null)
  const [position, setSongPosition, resetSongPosition] = useSongPosition(
    audioEl.current,
    playUrl,
    playerState
  )

  const handlePlayNewTrack = (name: string): void => {
    const { current } = audioEl
    if (!current) return

    if (!playUrl) {
      dispatch(playNewTrack(name))
      return
    }

    // If song is already playing prevent play until current track is loaded
    // TODO: rethink this
    if (current.readyState > 2) {
      resetSongPosition()
      dispatch(playNewTrack(name))
      return
    }
  }

  const handleNextOrPreviousTrack =
    (nextOrPrev: TrackDirection) => (): void => {
      const { current } = audioEl
      if (!current || current.readyState <= 2) return

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
            {metaData && (
              <ConcertMeta
                {...metaData}
                numTracks={trackList.length.toString()}
              />
            )}
            {trackList.length ? (
              <>
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
