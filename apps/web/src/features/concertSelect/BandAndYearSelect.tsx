import { useCallback, useEffect } from 'react'
import { Box, Stack, type SxProps } from '@mui/material'
import ConcertSelect from './components/ConcertSelect'
import ConcertSelectButton from './components/ConcertSelectButton'
import {
  handleClearBand,
  handleClearYear,
  handleLoadBandList,
  selectBand,
  selectYear,
} from './concertSelectSlice'
import FilterDuplicatesCheckbox from './components/FilterDuplicatesCheckbox'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getBandOptions, getYearOptions, withDispatch } from '../../app/util'

const boxStyles: SxProps = {
  width: '90%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

export default function BandAndYearSelect(): JSX.Element | null {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(handleLoadBandList())
  }, [])

  const { bandList, selectedBand, selectedYear } = useAppSelector(
    (state) => state.concertSelect
  )

  const options = useCallback(
    (selectedYear: string, selectedBand: string) => {
      return [
        {
          id: 'select-band-name',
          placeholder: 'Select a band',
          value: selectedBand,
          disabled: false,
          autocompleteOptions: getBandOptions(bandList),
          changeHandler: withDispatch(dispatch, selectBand),
          clearSelection: withDispatch(dispatch, handleClearBand),
        },
        {
          id: 'select-concert-year',
          placeholder: 'Select year (optional)',
          value: selectedYear,
          disabled: !selectedBand,
          autocompleteOptions: getYearOptions(bandList, selectedBand),
          changeHandler: withDispatch(dispatch, selectYear),
          clearSelection: withDispatch(dispatch, handleClearYear),
        },
      ]
    },
    [bandList]
  )

  return (
    <Box sx={boxStyles}>
      {options(selectedYear, selectedBand).map((opt) => (
        <ConcertSelect key={opt.id} {...opt} />
      ))}
      <Stack display="flex" flexDirection="row" justifyContent="space-between">
        <FilterDuplicatesCheckbox />
        <ConcertSelectButton />
      </Stack>
    </Box>
  )
}
