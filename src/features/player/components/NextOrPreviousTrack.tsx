import { Button, Box } from '@mui/material'
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp'
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp'
import { SxProps } from '@mui/system'

const buttonStyles: SxProps = {
  minWidth: '40px',
  padding: '4px 6px',
}

interface NextOrPreviousTrackProps {
  handleNextTrack: () => void
  handlePreviousTrack: () => void
}

export default function NextOrPreviousTrack({
  handleNextTrack,
  handlePreviousTrack,
}: NextOrPreviousTrackProps) {
  return (
    <Box width="55%" display="flex" justifyContent="space-around">
      <Button
        color="primary"
        variant="contained"
        size="small"
        aria-label="previous-track"
        sx={buttonStyles}
        onClick={handlePreviousTrack}
      >
        <SkipPreviousSharpIcon />
      </Button>
      <Button
        color="primary"
        variant="contained"
        size="small"
        aria-label="next-track"
        sx={buttonStyles}
        onClick={handleNextTrack}
      >
        <SkipNextSharpIcon />
      </Button>
    </Box>
  )
}
