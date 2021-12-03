import { useState } from 'react'
import { Box, Slider } from '@mui/material'

const progressBarStyles = {
  width: '100%',
  '& #progressBar': {
    width: '100%',
    padding: '20px 0',
  },
}

export default function ProgressBar({ duration }: { duration: number }) {
  const [position, setPosition] = useState(0)
  return (
    <Box sx={progressBarStyles}>
      <Slider
        aria-label="progress-bar"
        id="progressBar"
        // size="small"
        value={position}
        min={0}
        step={1}
        max={duration}
        onChange={(e, value) => setPosition(value as number)}
        // sx={}
      />
    </Box>
  )
}
