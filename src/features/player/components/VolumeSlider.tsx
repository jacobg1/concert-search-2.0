import { Stack, Slider, Box, Button, Popper } from '@mui/material'
import { VolumeUp } from '@mui/icons-material'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { usePopover } from '../../../app/hooks'
import { PopoverHandler, VolumeChangeHandler } from '../../../app/interface'

interface VolumeSliderProps {
  volume: number
  isMuted: boolean
  handleVolumeChange: VolumeChangeHandler
  handleToggleSound: () => void
}

interface VolumeButtonProps {
  toggle: boolean
  forMobile?: boolean
  clickHandler: PopoverHandler<HTMLButtonElement>
}

const VolumeButton = ({
  toggle,
  clickHandler,
  forMobile = false,
}: VolumeButtonProps): JSX.Element => {
  return (
    <Button
      color="primary"
      variant="contained"
      size="small"
      aria-label="volume-control"
      sx={{
        minWidth: '40px',
        padding: '4px 6px',
        '@media (min-width: 768px)': {
          display: forMobile ? 'none' : 'inline-flex',
        },
        '@media (max-width: 768px)': {
          display: forMobile ? 'inline-flex' : 'none',
        },
      }}
      onClick={clickHandler}
    >
      {toggle ? <CloseSharpIcon /> : <VolumeUp />}
    </Button>
  )
}
export default function VolumeSlider({
  volume,
  handleVolumeChange,
  isMuted,
  handleToggleSound,
}: VolumeSliderProps): JSX.Element {
  const [htmlEl, isOpen, handleOpen, handleClose] =
    usePopover<HTMLButtonElement>()

  return (
    <Box>
      <VolumeButton
        forMobile={true}
        toggle={isMuted}
        clickHandler={handleToggleSound}
      />
      <VolumeButton
        toggle={isOpen}
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
