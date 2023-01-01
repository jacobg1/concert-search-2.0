import { Button } from '@mui/material'
// import PlayArrowIcon from '@mui/icons-material/PlayArrow'

interface PlayConcertButtonProps {
  playConcert: (identifier: string) => void
  concertId: string
}

export default function PlayConcertButton({
  playConcert,
  concertId,
}: PlayConcertButtonProps): JSX.Element {
  return (
    <Button
      sx={{
        display: 'flex',
        marginRight: { xs: '8px', md: '15px', lg: '18px' },
        padding: 0,
        fontSize: '14px',
      }}
      variant="contained"
      color="primary"
      onClick={(e) => {
        e.stopPropagation() // prevent accordion from opening
        playConcert(concertId)
      }}
      // endIcon={<PlayArrowIcon fontSize="medium" />}
    >
      Play
    </Button>
  )
}
