import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import PlayOrPause from './components/PlayOrPause'
import VolumeSlider from './components/VolumeSlider'
import { background } from '../../app/background'
import { SxProps } from '@mui/system'
import NextOrPreviousTrack from './components/NextOrPreviousTrack'
import ProgressBar from './components/ProgressBar'
import {
  AudioRef,
  PlayerState,
  SongPositionHandler,
  VolumeChangeHandler,
} from '../../app/interface'
import {
  useAppDispatch,
  useToggleSound,
  useVolumeChange,
  usePlayPause,
  useSongDuration,
} from '../../app/hooks'
import { setPlayerState } from '../selectedConcert/selectedConcertSlice'

const { Play, Pause } = PlayerState

const audioPlayerStyles: SxProps = {
  padding: { xs: '14px 10px 20px' },
  width: '90%',
  border: '2px solid white',
  background,
  boxSizing: 'border-box',
}

const containerStyles: SxProps = {
  width: { xs: '80%', md: '25%' },
  margin: 'auto',
  flexDirection: 'row',
  justifyContent: 'space-between',
}

interface AudioPlayerProps {
  handleNextTrack: () => void
  handlePreviousTrack: () => void
  setSongPosition: SongPositionHandler
  position: number
  playerState: PlayerState
  playUrl: string
  audioEl: AudioRef
}

export default function AudioPlayer({
  handleNextTrack,
  handlePreviousTrack,
  setSongPosition,
  playerState,
  position,
  audioEl,
  playUrl,
}: AudioPlayerProps): JSX.Element {
  const dispatch = useAppDispatch()
  const [volume, setVolume] = useState<number>(25)
  const [isMuted, handleToggleSound] = useToggleSound(audioEl.current)
  const duration = useSongDuration(audioEl.current, playUrl)

  useVolumeChange(audioEl.current, volume, playerState)
  usePlayPause(audioEl.current, playUrl, playerState)

  const handleVolumeChange: VolumeChangeHandler = (_e, newValue) => {
    const { current } = audioEl

    if (current) {
      setVolume(newValue as number)
    }
  }

  const isPlaying = (current: HTMLAudioElement): boolean => {
    return !!(
      current.currentTime > 0 &&
      !current.paused &&
      !current.ended &&
      current.readyState > 2
    )
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

  return (
    <Box my={3} sx={audioPlayerStyles}>
      <ProgressBar
        duration={duration}
        position={position}
        setSongPosition={setSongPosition}
      />
      <Stack sx={containerStyles}>
        <PlayOrPause
          isPlaying={playerState === PlayerState.Play}
          onPlayPauseClick={onPlayPauseClick}
        />
        <NextOrPreviousTrack
          handlePreviousTrack={handlePreviousTrack}
          handleNextTrack={handleNextTrack}
        />
        <VolumeSlider
          volume={volume}
          isMuted={isMuted}
          handleToggleSound={handleToggleSound}
          handleVolumeChange={handleVolumeChange}
        />
      </Stack>
    </Box>
  )
}
