import { Button } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

interface PlayConcertButtonProps {
  playConcert: (identifier: string) => void
  identifier: string
}

export default function PlayConcertButton({
  playConcert,
  identifier,
}: PlayConcertButtonProps): JSX.Element {
  return (
    <Button
      sx={{
        display: 'flex',
        alignItems: 'start',
      }}
      variant="contained"
      color="primary"
      onClick={() => playConcert(identifier)}
      endIcon={<PlayArrowIcon fontSize="small" />}
    >
      Play
    </Button>
  )
}
