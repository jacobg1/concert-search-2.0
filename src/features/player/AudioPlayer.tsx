import { RefObject, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
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
import { setPlayerState } from '../selectedConcert/selectedConcertSlice'
import SkipButton from './components/SkipButton'
import { AudioPlayerProps } from './playerInterface'
import { AudioElement } from './components/AudioElement'
import {
  useSongDuration,
  usePlayPause,
  useVolumeChange,
  useAppDispatch,
} from '../../app/hooks'

const { Play, Pause } = PlayerState
const { Next, Prev } = TrackDirection

const audioPlayerStyles: SxProps = {
  padding: '14px 10px 20px',
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
  const duration = useSongDuration(audioEl, playUrl)

  useVolumeChange(audioEl, volume, playerState)
  usePlayPause(audioEl, playUrl, playerState)

  const handleVolumeChange: VolumeChangeHandler = (_e, newValue) => {
    if (audioEl.current) {
      setVolume(newValue as number)
    }
  }

  const isPlaying = (el: RefObject<HTMLAudioElement>): boolean => {
    if (!el.current) return false
    return !!(
      el.current.currentTime > 0 &&
      !el.current.paused &&
      !el.current.ended &&
      el.current.readyState > 2
    )
  }

  const onPlayPauseClick = (): void => {
    if (!audioEl.current) return

    if (!isPlaying(audioEl)) {
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
