import { Button, Box } from '@mui/material'
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp'
import { useAppDispatch } from '../../../app/hooks'
import { toggleConcertDrawer } from '../selectedConcertSlice'

export function BackButton(): JSX.Element {
  const dispatch = useAppDispatch()

  return (
    <Box
      style={{
        width: '90%',
        margin: '30px auto 20px',
        textAlign: 'left',
      }}
    >
      <Button
        variant="contained"
        size="large"
        style={{
          color: 'black',
          background: '#bed5ff',
          textTransform: 'none',
          alignItems: 'flex-start',
        }}
        onClick={() => dispatch(toggleConcertDrawer())}
      >
        <SkipPreviousSharpIcon /> Back
      </Button>
    </Box>
  )
}
