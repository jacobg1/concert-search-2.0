import { Box, Button, ClassNameMap } from '@mui/material'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import ConcertSelect from './components/ConcertSelect'
import {
  handleLoadBandList,
  selectBand,
  selectYear,
  clearBand,
  clearYear,
} from './concertSelectSlice'

const buttonStyles: ClassNameMap = {
  width: '25%',
  alignSelf: 'flex-end',
  padding: '10px',
}
const boxStyles: ClassNameMap = {
  width: '90%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '185px',

  // backgroundColor: {
  //   sm: 'red',
  // },
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
        autocompleteOptions={formatter(Object.keys(bandList))}
        changeHandler={(selection) => dispatch(selectBand(selection))}
        clearHandler={() => dispatch(clearBand())}
      />
      <ConcertSelect
        id="select-concert-year"
        placeholder="Select year (optional)"
        value={selectedYear}
        autocompleteOptions={
          selectedBand ? formatter(bandList[selectedBand]) : []
        }
        changeHandler={(selection) => dispatch(selectYear(selection))}
        clearHandler={() => dispatch(clearYear())}
      />
      <Button sx={buttonStyles} variant="contained" color="primary">
        Crawl
      </Button>
    </Box>
  )
}
