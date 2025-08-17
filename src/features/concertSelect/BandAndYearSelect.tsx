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

const boxStyles: SxProps = {
  width: '90%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const formatter = (array: string[]) => array.map((x) => ({ label: x }))

type BandList = Record<string, string[]> | null

function getBandOptions(bandList: BandList) {
  if (!bandList) return []
  return formatter(Object.keys(bandList))
}

function getYearOptions(bandList: BandList, selectedBand?: string) {
  if (!bandList || !selectedBand) return []
  return formatter(bandList[selectedBand])
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
          changeHandler: (selection: string) => dispatch(selectBand(selection)),
          clearSelection: () => dispatch(handleClearBand()),
        },
        {
          id: 'select-concert-year',
          placeholder: 'Select year (optional)',
          value: selectedYear,
          disabled: !selectedBand,
          autocompleteOptions: getYearOptions(bandList, selectedBand),
          changeHandler: (selection: string) => dispatch(selectYear(selection)),
          clearSelection: () => dispatch(handleClearYear()),
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
