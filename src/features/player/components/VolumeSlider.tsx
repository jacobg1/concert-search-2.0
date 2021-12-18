import { Stack, Slider, Box, Button, Popper } from '@mui/material'
import { VolumeUp } from '@mui/icons-material'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { usePopover } from '../../../app/hooks'
import { PopoverHandler, VolumeChangeHandler } from '../../../app/interface'

interface VolumeSliderProps {
  volume: number
  handleVolumeChange: VolumeChangeHandler
}

interface VolumeButtonProps {
  isOpen: boolean
  clickHandler: PopoverHandler<HTMLButtonElement>
}

const VolumeButton = ({
  isOpen,
  clickHandler,
}: VolumeButtonProps): JSX.Element => {
  return (
    <Button
      color="primary"
      variant="contained"
      size="small"
      aria-label="volume-control"
      style={{
        minWidth: '40px',
        padding: '4px 6px',
      }}
      onClick={clickHandler}
    >
      {isOpen ? <CloseSharpIcon /> : <VolumeUp />}
    </Button>
  )
}
export default function VolumeSlider({
  volume,
  handleVolumeChange,
}: VolumeSliderProps): JSX.Element {
  const [htmlEl, isOpen, handleOpen, handleClose] =
    usePopover<HTMLButtonElement>()

  return (
    <Box>
      <VolumeButton
        isOpen={isOpen}
        clickHandler={!isOpen ? handleOpen : handleClose}
      />
      <Popper
        id="vol-control"
        placement="top-end"
        open={isOpen}
        anchorEl={htmlEl}
      >
        <Stack bgcolor="#bed5ff">
          <Slider
            style={{ width: '225px', margin: '11px' }}
            value={volume}
            min={0}
            max={100}
            onChange={handleVolumeChange}
          />
        </Stack>
      </Popper>
    </Box>
  )
}
