import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../app/store'
import { ConcertSelectState } from './concertSelectInterface'
import artistYearList from './options/artistYearList.json'

const initialState: ConcertSelectState = {
  bandList: null,
  selectedBand: '',
  selectedYear: '',
  filterDuplicates: true,
}

export const concertSelectSlice = createSlice({
  name: 'concertSelect',
  initialState,
  reducers: {
    // immerjs allows us mutate state in these reducers
    loadBandList: (state, action: PayloadAction<{ [k: string]: string[] }>) => {
      state.bandList = action.payload
    },
    selectBand: (state, action: PayloadAction<string>) => {
      state.selectedBand = action.payload
      // Clear year when band changes
      state.selectedYear = ''
    },
    selectYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload
    },
    setFilterDuplicates: (state, action: PayloadAction<boolean>) => {
      state.filterDuplicates = action.payload
    },
  },
})

const { loadBandList } = concertSelectSlice.actions

export const { selectBand, selectYear, setFilterDuplicates } =
  concertSelectSlice.actions

export const handleLoadBandList = (): AppThunk => (dispatch) => {
  dispatch(loadBandList(artistYearList))
}

export default concertSelectSlice.reducer
