import { Stack, Slider, Box, Button, Popper } from '@mui/material'
import { VolumeUp } from '@mui/icons-material'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { usePopover } from '../../../app/hooks'

type ClickAwayEvent = Event | React.SyntheticEvent

interface VolumeSliderProps {
  volume: number
  handleVolumeChange: (event: Event, newValue: number | number[]) => void
}

export default function VolumeSlider({
  volume,
  handleVolumeChange,
}: VolumeSliderProps) {
  const [htmlEl, isOpen, handleOpen, handleClose] =
    usePopover<HTMLButtonElement>()

  return (
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="small"
        aria-label="volume-control"
        sx={{
          minWidth: '40px',
          padding: '4px 6px',
        }}
        onClick={!isOpen ? handleOpen : handleClose}
      >
        <VolumeUp />
      </Button>
      <Popper
        id="vol-control"
        placement="top-end"
        open={isOpen}
        anchorEl={htmlEl}
      >
        {() => (
          <ClickAwayListener
            onClickAway={handleClose as (event: ClickAwayEvent) => void}
          >
            <Stack bgcolor="#bed5ff" width="200px">
              <Slider
                sx={{ width: '90%', margin: 'auto', padding: '20px 0' }}
                value={volume}
                onChange={handleVolumeChange}
              />
            </Stack>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  )
}
