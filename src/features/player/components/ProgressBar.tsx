import { Box, Slider, Typography } from '@mui/material'
import { durationFormat } from '../../../app/util'
import { DurationLabelProps, ProgressBarProps } from '../playerInterface'

const progressBarHolderStyles = {
  width: '100%',
  margin: '5px auto 15px auto',
  '& .MuiSlider-rail, & .MuiSlider-track': {
    height: { xs: 5, md: 10 },
  },
  '& .MuiSlider-colorPrimary': {
    padding: '13px 0',
  },
  '& .MuiSlider-thumb': {
    height: { xs: 12, md: 18 },
    width: { xs: 12, md: 18 },
  },
  '& .Mui-disabled': {
    '.MuiSlider-thumb': {
      color: '#2e7e89',
      opacity: '.7',
    },
    '.MuiTypography-body': {
      opacity: '.7',
    },
  },
}

const DurationLabel = ({
  time,
  disabled,
  prefix,
}: DurationLabelProps): JSX.Element => {
  return (
    <Typography
      style={{
        width: '50px',
        textAlign: 'center',
        ...(disabled && { opacity: '.7' }),
      }}
    >
      {prefix ? `${prefix}${time}` : time}
    </Typography>
  )
}

export default function ProgressBar({
  duration,
  position,
  setSongPosition,
}: ProgressBarProps): JSX.Element {
  const songDuration = (durationValue: number): string => {
    const [calcMinutes, calcSecondsLeft, addZero] =
      durationFormat(durationValue)

    return `${calcMinutes}:${addZero(calcSecondsLeft)}`
  }

  return (
    <Box
      sx={progressBarHolderStyles}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <DurationLabel disabled={duration === 0} time={songDuration(position)} />
      <Slider
        aria-label="progress-bar"
        id="progressBar"
        color="primary"
        value={position}
        min={0}
        step={1}
        max={duration}
        disabled={duration === 0}
        onChange={(_e, value) => setSongPosition(value as number)}
      />

      <DurationLabel
        prefix="-"
        disabled={duration === 0}
        time={songDuration(duration - position)}
      />
    </Box>
  )
}
