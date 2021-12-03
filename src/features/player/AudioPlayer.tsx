import { Box, Stack } from '@mui/material'
import PlayOrPause from './components/PlayOrPause'
import VolumeSlider from './components/VolumeSlider'
import { background } from '../../app/background'
import { SxProps } from '@mui/system'
import NextOrPreviousTrack from './components/NextOrPreviousTrack'
import ProgressBar from './components/ProgressBar'

const audioPlayerStyles: SxProps = {
  padding: '16px 16px 0',
  width: '90%',
  border: '2px solid black',
  background,
  boxSizing: 'border-box',
  position: 'absolute',
  bottom: 0,
}

interface AudioPlayerProps {
  handleNextTrack: () => void
  handlePreviousTrack: () => void
  onPlayPauseClick: () => void
  handleVolumeChange: (event: Event, newValue: number | number[]) => void
  volume: number
  duration: number
  playerState: 'play' | 'pause'
}

export default function AudioPlayer({
  handleNextTrack,
  handlePreviousTrack,
  onPlayPauseClick,
  handleVolumeChange,
  playerState,
  volume,
  duration,
}: AudioPlayerProps) {
  return (
    <Box my={3} sx={audioPlayerStyles}>
      <Stack flexDirection="row" justifyContent="space-between">
        <PlayOrPause
          isPlaying={playerState === 'play'}
          onPlayPauseClick={onPlayPauseClick}
        />
        <NextOrPreviousTrack
          handlePreviousTrack={handlePreviousTrack}
          handleNextTrack={handleNextTrack}
        />
        <VolumeSlider volume={volume} handleVolumeChange={handleVolumeChange} />
      </Stack>
      <ProgressBar duration={duration} />
    </Box>
  )
}
