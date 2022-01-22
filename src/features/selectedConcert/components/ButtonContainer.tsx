import { Box } from '@mui/material'
import { IconDirection } from '../../../app/interface'
import { BackButton } from './BackButton'

export function ButtonContainer(): JSX.Element {
  return (
    <Box
      style={{
        width: '90%',
        margin: '30px auto 20px',
        textAlign: 'left',
      }}
    >
      <BackButton iconDirection={IconDirection.Left} />
    </Box>
  )
}
