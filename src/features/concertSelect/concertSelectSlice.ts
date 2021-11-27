import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../app/store'
import artistYearList from './options/artistYearList.json'

export interface ConcertSelectState {
  bandList: Record<string, string[]> | null
  selectedBand: string
  selectedYear: string
}

const initialState: ConcertSelectState = {
  bandList: null,
  selectedBand: '',
  selectedYear: '',
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
    clearBand: (state) => {
      state.selectedBand = ''
      // Clear year when band changes
      state.selectedYear = ''
    },
    clearYear: (state) => {
      state.selectedYear = ''
    },
  },
})

const { loadBandList } = concertSelectSlice.actions

export const { selectBand, selectYear, clearBand, clearYear } =
  concertSelectSlice.actions

// TODO: load this from back end
export const handleLoadBandList = (): AppThunk => (dispatch) => {
  dispatch(loadBandList(artistYearList))
}

export default concertSelectSlice.reducer
