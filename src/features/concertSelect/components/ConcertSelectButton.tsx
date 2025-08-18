import { Button, type SxProps } from '@mui/material'
import { fetchConcertList } from '../../concerts/concertListSlice'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { SortOrder } from '../../../app/interface'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'

const buttonStyles: SxProps = {
  alignSelf: 'flex-end',
  padding: {
    xs: '10px 20px',
    md: '10px 26px',
    lg: '10px 29px',
  },
  fontSize: { xs: '12px', sm: '14px' },
}

export default function ConcertSelectButton(): JSX.Element {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.concertList)
  const { selectedBand, selectedYear, filterDuplicates } = useAppSelector(
    (state) => state.concertSelect
  )

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
