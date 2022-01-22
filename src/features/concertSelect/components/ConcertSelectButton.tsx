import { Button } from '@mui/material'
import { SxProps } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchConcertList } from '../../concerts/concertListSlice'
import { ConcertSelectButtonProps } from '../concertSelectInterface'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

const buttonStyles: SxProps = {
  width: '30%',
  alignSelf: 'flex-end',
  padding: '11.5px 0px',
  maxWidth: '125px',
}

export default function ConcertSelectButton({
  selectedBand,
  selectedYear,
}: ConcertSelectButtonProps): JSX.Element {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.concertList)
  return (
    <Button
      variant="contained"
      color="primary"
      sx={buttonStyles}
      disabled={!selectedBand || loading}
      onClick={() =>
        dispatch(
          fetchConcertList({
            bandName: selectedBand.replace(/ /g, '+'),
            year: selectedYear,
          })
        )
      }
      endIcon={<SearchSharpIcon style={{ paddingLeft: '5px' }} />}
    >
      Search
    </Button>
  )
}
