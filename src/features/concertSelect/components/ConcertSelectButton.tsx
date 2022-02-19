import { Button } from '@mui/material'
import { SxProps } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchConcertList } from '../../concerts/concertListSlice'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { SortOrder } from '../../../app/interface'

const buttonStyles: SxProps = {
  width: '30%',
  alignSelf: 'flex-end',
  padding: '11.5px 0px',
  maxWidth: '125px',
}

export default function ConcertSelectButton(): JSX.Element {
  const dispatch = useAppDispatch()
  const {
    concertList: { loading },
    concertSelect: { selectedBand, selectedYear, filterDuplicates },
  } = useAppSelector((state) => state)

  return (
    <Button
      variant="contained"
      color="primary"
      sx={buttonStyles}
      disabled={!selectedBand || loading}
      onClick={() =>
        dispatch(
          fetchConcertList({
            filterDuplicates,
            year: selectedYear,
            bandName: selectedBand.replace(/ /g, '+'),
            sortBy: { downloads: SortOrder.DESC },
          })
        )
      }
      endIcon={<SearchSharpIcon style={{ paddingLeft: '5px' }} />}
    >
      Search
    </Button>
  )
}
