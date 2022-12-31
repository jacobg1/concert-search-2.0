import { useEffect } from 'react'
import { SxProps } from '@mui/system'
import { Box, Stack } from '@mui/material'
import ConcertSelect from './components/ConcertSelect'
import ConcertSelectButton from './components/ConcertSelectButton'
import {
  handleLoadBandList,
  selectBand,
  selectYear,
} from './concertSelectSlice'
import FilterDuplicatesCheckbox from './components/FilterDuplicatesCheckbox'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

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

  const formatter = (array: string[]) => array.map((x) => ({ label: x }))

  if (!bandList) return null

  const options = [
    {
      id: 'select-band-name',
      placeholder: 'Select a band',
      value: selectedBand,
      disabled: false,
      autocompleteOptions: formatter(Object.keys(bandList)),
      changeHandler: (selection: string) => dispatch(selectBand(selection)),
    },
    {
      id: 'select-concert-year',
      placeholder: 'Select year (optional)',
      value: selectedYear,
      disabled: !selectedBand,
      autocompleteOptions: selectedBand
        ? formatter(bandList[selectedBand])
        : [],
      changeHandler: (selection: string) => dispatch(selectYear(selection)),
    },
  ]

  return (
    <Box sx={boxStyles}>
      {options.map((opt) => (
        <ConcertSelect key={opt.id} {...opt} />
      ))}
      <Stack display="flex" flexDirection="row" justifyContent="space-between">
        <FilterDuplicatesCheckbox />
        <ConcertSelectButton />
      </Stack>
    </Box>
  )
}
