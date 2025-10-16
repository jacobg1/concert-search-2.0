import { Box } from '@mui/material'
import { IconDirection } from '../../../app/interface'
import SongFormatSelect from '../../tracks/components/SongFormatSelect'
import { BackButton } from './BackButton'

export function ButtonContainer(): JSX.Element {
  return (
    <Box
      style={{
        width: '90%',
        margin: '30px auto 20px',
        display: 'flex',
        justifyContent: 'space-between',
        // alignItems: 'center',
      }}
    >
      <BackButton iconDirection={IconDirection.Left} />
      <SongFormatSelect />
    </Box>
  )
}
