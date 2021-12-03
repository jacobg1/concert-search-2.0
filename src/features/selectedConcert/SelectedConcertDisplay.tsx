import { useRef, useState } from 'react'
import { CircularProgress, Drawer, Stack } from '@mui/material'
import { SxProps } from '@mui/system'
import {
  useAppDispatch,
  useAppSelector,
  usePlayPause,
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

    // If song is already playing
    // prevent play until current track is loaded
    if (current.readyState > 2) {
      dispatch(playNewTrack(name))
      return
    }
  }

  const onPlayPauseClick = (): void => {
    const { current } = audioEl
    if (!current) return

    if (!isPlaying(current)) {
      dispatch(setPlayerState('play'))
    } else {
      dispatch(setPlayerState('pause'))
    }
  }

  const handleNextOrPreviousTrack = (nextOrPrev: string) => (): void => {
    const { current } = audioEl
    if (!current || current.readyState <= 2) return

    if (nextOrPrev === 'next') {
      dispatch(playNextTrack())
    } else {
      dispatch(playPreviousTrack())
    }
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const { current } = audioEl

    if (current) {
      setVolume(newValue as number)
    }
  }

  const getDuration = (current: HTMLAudioElement | null): number => {
    return !current || isNaN(current.duration) ? 0 : current.duration
  }

  return (
    <Drawer
      sx={drawerStyles}
      variant="persistent"
      anchor="bottom"
      open={isDrawerOpen}
      hideBackdrop
    >
      <Stack my={15} alignItems="center">
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <>
            {metaData && (
              <ConcertMeta
                date={metaData.date}
                title={metaData.title}
                description={metaData.description}
                creator={metaData.creator}
                venue={metaData.venue}
                source={metaData.source}
              />
            )}
            {trackList.length ? (
              <>
                <AudioElement
                  ref={audioEl}
                  src={playUrl}
                  handleNextTrack={handleNextOrPreviousTrack('next')}
                />
                <TrackListDisplay
                  trackList={trackList}
                  currentTrackName={currentTrackName}
                  playNewTrack={handlePlayNewTrack}
                />
                <AudioPlayer
                  volume={volume}
                  playerState={playerState}
                  duration={getDuration(audioEl.current)}
                  handleVolumeChange={handleVolumeChange}
                  onPlayPauseClick={onPlayPauseClick}
                  handleNextTrack={handleNextOrPreviousTrack('next')}
                  handlePreviousTrack={handleNextOrPreviousTrack('prev')}
                />
              </>
            ) : null}
          </>
        )}
      </Stack>
    </Drawer>
  )
}
