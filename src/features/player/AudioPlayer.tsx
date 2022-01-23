import { Box, Stack } from '@mui/material'
import PlayOrPause from './components/PlayOrPause'
import VolumeSlider from './components/VolumeSlider'
import { background } from '../../app/background'
import { SxProps } from '@mui/system'
import NextOrPreviousTrack from './components/NextOrPreviousTrack'
import ProgressBar from './components/ProgressBar'
import {
  PlayerState,
  SongPositionHandler,
  VolumeChangeHandler,
} from '../../app/interface'

const audioPlayerStyles: SxProps = {
  padding: { xs: '14px 10px 20px' },
  width: '90%',
  // border: '2px solid white',
  background,
  boxSizing: 'border-box',
}

interface AudioPlayerProps {
  handleNextTrack: () => void
  handlePreviousTrack: () => void
  onPlayPauseClick: () => void
  handleToggleSound: () => void
  handleVolumeChange: VolumeChangeHandler
  setSongPosition: SongPositionHandler
  volume: number
  duration: number
  position: number
  playerState: PlayerState
  isMuted: boolean
}

export default function AudioPlayer({
  handleNextTrack,
  handlePreviousTrack,
  onPlayPauseClick,
  handleVolumeChange,
  setSongPosition,
  handleToggleSound,
  playerState,
  volume,
  duration,
  position,
  isMuted,
}: AudioPlayerProps): JSX.Element {
  return (
    <Box my={3} sx={audioPlayerStyles}>
      <ProgressBar
        duration={duration}
        position={position}
        setSongPosition={setSongPosition}
      />
      <Stack
        sx={{
          width: { xs: '80%', md: '25%' },
          margin: 'auto',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
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
