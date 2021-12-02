import { useEffect, useRef, useState } from 'react'
import { CircularProgress, Drawer, Stack } from '@mui/material'
import { SxProps } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
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

interface SelectedConcertDisplayProps {
  isDrawerOpen: boolean
}

export default function SelectedConcertDisplay({
  isDrawerOpen,
}: SelectedConcertDisplayProps): JSX.Element {
  const {
    loading,
    playerState,
    currentlyPlayingTrack: { playUrl, currentTrackName },
    selectedConcert: { trackList, metaData },
  } = useAppSelector((state) => state.individualConcert)

  const dispatch = useAppDispatch()
  const audioEl = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState<number>(25)

  useEffect(() => {
    const { current } = audioEl

    if (current) {
      current.volume = (volume as number) / 100
    }
  }, [volume, playerState])

  useEffect(() => {
    const { current } = audioEl
    if (!current) return

    if (playerState === 'play') {
      current.play()
    } else {
      current.pause()
    }
  }, [playerState, playUrl])

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

  const handleNextTrack = (): void => {
    const { current } = audioEl

    if (current && current.readyState > 2) {
      dispatch(playNextTrack())
    }
  }

  const handlePreviousTrack = (): void => {
    const { current } = audioEl

    if (current && current.readyState > 2) {
      dispatch(playPreviousTrack())
    }
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
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
                  handleNextTrack={handleNextTrack}
                  ref={audioEl}
                  src={playUrl}
                />
                <TrackListDisplay
                  trackList={trackList}
                  playNewTrack={handlePlayNewTrack}
                  currentTrackName={currentTrackName}
                />
                <AudioPlayer
                  volume={volume}
                  playerState={playerState}
                  onPlayPauseClick={onPlayPauseClick}
                  handleNextTrack={handleNextTrack}
                  handlePreviousTrack={handlePreviousTrack}
                  handleVolumeChange={handleVolumeChange}
                />
              </>
            ) : null}
          </>
        )}
      </Stack>
    </Drawer>
  )
}
