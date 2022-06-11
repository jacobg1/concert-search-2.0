import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import PlayOrPause from './components/PlayOrPause'
import VolumeSlider from './components/VolumeSlider'
import { background } from '../../app/background'
import { SxProps } from '@mui/system'
import ProgressBar from './components/ProgressBar'
import {
  PlayerState,
  TrackDirection,
  VolumeChangeHandler,
} from '../../app/interface'
import {
  useAppDispatch,
  useVolumeChange,
  usePlayPause,
  useSongDuration,
} from '../../app/hooks'
import { setPlayerState } from '../selectedConcert/selectedConcertSlice'
import SkipButton from './components/SkipButton'
import { AudioPlayerProps } from './playerInterface'
import { AudioElement } from './components/AudioElement'

const { Play, Pause } = PlayerState
const { Next, Prev } = TrackDirection

const audioPlayerStyles: SxProps = {
  padding: { xs: '14px 10px 20px' },
  width: '90%',
  background,
  boxSizing: 'border-box',
}

const containerStyles: SxProps = {
  width: { xs: '80%', md: '35%' },
  maxWidth: '300px',
  margin: 'auto',
  flexDirection: 'row',
  justifyContent: 'space-between',
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
        <SkipButton direction={Prev} clickHandler={handlePreviousTrack} />
        <PlayOrPause
          isPlaying={playerState === PlayerState.Play}
          onPlayPauseClick={onPlayPauseClick}
        />
        <SkipButton direction={Next} clickHandler={handleNextTrack} />
        <VolumeSlider volume={volume} handleVolumeChange={handleVolumeChange} />
      </Stack>
      <AudioElement
        ref={audioEl}
        src={playUrl}
        handleNextTrack={handleNextTrack}
      />
    </Box>
  )
}
