import { Box } from '@mui/material'
import recordPlayer from '../../images/vinyl.svg'

export function VisualizerPaused(): JSX.Element {
  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      justifyContent="center"
      height="150px"
    >
      <img style={{ width: '110px' }} src={recordPlayer} alt="record-icon" />
    </Box>
  )
}
