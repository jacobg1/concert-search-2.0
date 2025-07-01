import { Button, type SxProps } from '@mui/material'
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp'
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp'
import { TrackDirection } from '../../../app/interface'
import { NextOrPreviousTrackProps } from '../playerInterface'

const buttonStyles: SxProps = {
  minWidth: '40px',
  padding: '4px 6px',
}

const { Prev } = TrackDirection

export default function SkipButton({
  clickHandler,
  direction,
}: NextOrPreviousTrackProps): JSX.Element {
  return (
    <Button
      color="primary"
      variant="contained"
      size="small"
      aria-label={`${direction}-track`}
      sx={buttonStyles}
      onClick={clickHandler}
    >
      {direction === Prev ? <SkipPreviousSharpIcon /> : <SkipNextSharpIcon />}
    </Button>
  )
}
