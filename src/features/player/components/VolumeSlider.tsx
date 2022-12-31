import { Stack, Slider, Button, Popper } from '@mui/material'
import { VolumeUp } from '@mui/icons-material'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { VolumeButtonProps, VolumeSliderProps } from '../playerInterface'
import { usePopover } from '../../../app/hooks'

const VolumeButton = ({
  toggle,
  clickHandler,
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
        display: { xs: 'none', md: 'inline-flex' },
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
}: VolumeSliderProps): JSX.Element {
  const [htmlEl, isOpen, handleOpen, handleClose] =
    usePopover<HTMLButtonElement>()

  return (
    <>
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
    </>
  )
}
