import { Button } from '@mui/material'
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp'
import { toggleConcertDrawer } from '../selectedConcertSlice'
import { IconDirection } from '../../../app/interface'
import { useAppDispatch } from '../../../app/hooks'

export function BackButton({
  iconDirection,
}: {
  iconDirection: IconDirection
}): JSX.Element {
  const dispatch = useAppDispatch()

  return (
    <Button
      variant="contained"
      size="large"
      style={{
        color: 'black',
        background: '#bed5ff',
        padding: 0,
      }}
      onClick={() => dispatch(toggleConcertDrawer())}
    >
      <ArrowLeftSharpIcon
        style={{
          transform: iconDirection === 'right' ? 'rotate(180deg)' : 'rotate(0)',
        }}
        fontSize="large"
      />
    </Button>
  )
}
