import { Button, ClassNameMap } from '@mui/material'
import { useAppDispatch } from '../../../app/hooks'
import { fetchConcertList } from '../../concerts/concertListSlice'
import { ConcertSelectButtonProps } from '../concertSelectInterface'

const buttonStyles: ClassNameMap = {
  width: '25%',
  alignSelf: 'flex-end',
  padding: '10px',
}

export default function ConcertSelectButton({
  selectedBand,
  selectedYear,
}: ConcertSelectButtonProps): JSX.Element {
  const dispatch = useAppDispatch()

  return (
    <Button
      variant="contained"
      color="primary"
      sx={buttonStyles}
      disabled={!selectedBand}
      onClick={() =>
        dispatch(
          fetchConcertList({
            bandName: selectedBand.replace(/ /g, '+'),
            year: selectedYear,
          })
        )
      }
    >
      Crawl
    </Button>
  )
}