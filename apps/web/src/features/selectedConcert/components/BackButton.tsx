import { Button } from '@mui/material'
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp'
import {
  setShowPlaylist,
  toggleConcertDrawer,
} from '../selectedConcertSlice'
import { useAppDispatch } from '../../../app/hooks'
import { BackButtonProps } from '../interface'

export function BackButton({
  iconDirection,
  hasTracklist,
}: BackButtonProps): JSX.Element {
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
      onClick={() => {
        dispatch(toggleConcertDrawer())
        if (!hasTracklist) {
          dispatch(setShowPlaylist(true))
        }
      }}
    >
      <ArrowLeftSharpIcon
        style={{
          transform:
            iconDirection === 'right' ? 'rotate(180deg)' : 'rotate(0)',
        }}
        fontSize="large"
      />
    </Button>
  )
}
