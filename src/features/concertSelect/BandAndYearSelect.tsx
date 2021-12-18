import { useEffect } from 'react'
import { SxProps } from '@mui/system'
import { Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import ConcertSelect from './components/ConcertSelect'
import ConcertSelectButton from './components/ConcertSelectButton'
import {
  handleLoadBandList,
  selectBand,
  selectYear,
  clearBand,
  clearYear,
} from './concertSelectSlice'

const boxStyles: SxProps = {
  width: '90%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '185px',
  marginTop: '105px',
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

  return (
    <Box sx={boxStyles}>
      <ConcertSelect
        id="select-band-name"
        placeholder="Select a band"
        value={selectedBand}
        disabled={false}
        autocompleteOptions={formatter(Object.keys(bandList))}
        changeHandler={(selection) => dispatch(selectBand(selection))}
        clearHandler={() => dispatch(clearBand())}
      />
      <ConcertSelect
        id="select-concert-year"
        placeholder="Select year (optional)"
        value={selectedYear}
        disabled={!selectedBand}
        autocompleteOptions={
          selectedBand ? formatter(bandList[selectedBand]) : []
        }
        changeHandler={(selection) => dispatch(selectYear(selection))}
        clearHandler={() => dispatch(clearYear())}
      />
      <ConcertSelectButton
        selectedBand={selectedBand}
        selectedYear={selectedYear}
      />
    </Box>
  )
}
