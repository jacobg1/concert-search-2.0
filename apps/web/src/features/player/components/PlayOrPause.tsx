import PauseSharpIcon from '@mui/icons-material/PauseSharp'
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp'
import { Button, Box } from '@mui/material'
import { PlayerState } from '../../../app/interface'
import { PlayOrPauseProps } from '../playerInterface'

const { Play, Pause } = PlayerState

export default function PlayOrPause({
  isPlaying,
  onPlayPauseClick,
}: PlayOrPauseProps): JSX.Element {
  return (
    <Box onClick={onPlayPauseClick}>
      <Button
        color="primary"
        variant="contained"
        size="small"
        aria-label={isPlaying ? Pause : Play}
        sx={{
          minWidth: '40px',
          padding: '4px 6px',
        }}
      >
        {isPlaying ? <PauseSharpIcon /> : <PlayArrowSharpIcon />}
      </Button>
    </Box>
  )
}
