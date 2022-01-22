import { useRef, useState } from 'react'
import { CircularProgress, Drawer, Stack } from '@mui/material'
import { SxProps } from '@mui/system'
import {
  useAppDispatch,
  useAppSelector,
  usePlayPause,
  useSongDuration,
  useSongPosition,
  useVolumeChange,
} from '../../app/hooks'
import TrackListDisplay from '../tracks/TrackListDisplay'
import ConcertMeta from '../tracks/components/ConcertMeta'
import AudioPlayer from '../player/AudioPlayer'
import { AudioElement } from '../player/components/AudioElement'
import {
  playNextTrack,
  playPreviousTrack,
  setPlayerState,
  playNewTrack,
} from './selectedConcertSlice'
import {
  PlayerState,
  TrackDirection,
  VolumeChangeHandler,
} from '../../app/interface'
import { ButtonContainer } from './components/ButtonContainer'

const { Play, Pause } = PlayerState
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
  const [volume, setVolume] = useState<number>(25)

  useVolumeChange(audioEl.current, volume, playerState)
  usePlayPause(audioEl.current, playUrl, playerState)

  const duration = useSongDuration(audioEl.current, playUrl)
  const [position, setSongPosition, resetSongPosition] = useSongPosition(
    audioEl.current,
    playUrl,
    playerState
  )

  const isPlaying = (current: HTMLAudioElement): boolean => {
    return !!(
      current.currentTime > 0 &&
      !current.paused &&
      !current.ended &&
      current.readyState > 2
    )
  }

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

  const onPlayPauseClick = (): void => {
    const { current } = audioEl
    if (!current) return

    if (!isPlaying(current)) {
      dispatch(setPlayerState(Play))
    } else {
      dispatch(setPlayerState(Pause))
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

  const handleVolumeChange: VolumeChangeHandler = (_e, newValue) => {
    const { current } = audioEl

    if (current) {
      setVolume(newValue as number)
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
      <Stack
        style={{
          width: '100%',
          maxWidth: '1000px',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <>
            <ButtonContainer />
            {metaData && (
              <ConcertMeta
                date={metaData.date}
                title={metaData.title}
                description={metaData.description}
                creator={metaData.creator}
                venue={metaData.venue}
                source={metaData.source}
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
                  volume={volume}
                  playerState={playerState}
                  duration={duration}
                  position={position}
                  setSongPosition={setSongPosition}
                  handleVolumeChange={handleVolumeChange}
                  onPlayPauseClick={onPlayPauseClick}
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
