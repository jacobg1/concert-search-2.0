import { Button, type SxProps } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

interface PlayConcertButtonProps {
  playConcert: (identifier: string) => void
  concertId: string
}

const playConcertStyles: SxProps = {
  display: 'flex',
  marginRight: { xs: '8px', md: '15px', lg: '18px' },
  padding: '3px 10px',
  fontSize: { xs: '12px', sm: '14px' },
  '& .MuiButton-endIcon': {
    '& .MuiSvgIcon-root': {
      fontSize: { xs: '18px', sm: '20px' },
    },
  },
}

export default function PlayConcertButton({
  playConcert,
  concertId,
}: PlayConcertButtonProps): JSX.Element {
  return (
    <Button
      sx={playConcertStyles}
      variant="contained"
      color="primary"
      onClick={(e) => {
        e.stopPropagation() // prevent accordion from opening
        playConcert(concertId)
      }}
      endIcon={<PlayArrowIcon fontSize="inherit" />}
    >
      Play
    </Button>
  )
}
