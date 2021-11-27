import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { TrackListData, TrackMetaData } from '../tracks/trackInterface'

interface SelectedConcert {
  metaData: TrackMetaData | Record<string, unknown>
  trackList: TrackListData[]
}

export const fetchSelectedConcert = createAsyncThunk(
  'selectedConcert/fetchselectedConcert',
  async (concertId: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/concert/${concertId}`,
      {
        method: 'GET',
      }
    )
    return response.json() as Promise<SelectedConcert>
  }
)

interface SelectedConcertState {
  selectedConcert: SelectedConcert
  isDrawerOpen: boolean
  loading: boolean
  error: Error | Record<string, unknown>
}

const initialState: SelectedConcertState = {
  selectedConcert: { trackList: [], metaData: {} },
  isDrawerOpen: false,
  loading: false,
  error: {},
}

const selectedConcertSlice = createSlice({
  name: 'selectedConcert',
  initialState,
  reducers: {
    toggleConcertDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen
    },
  },
  extraReducers: {
    // Loading
    [fetchSelectedConcert.pending.type]: (state) => {
      // Open concert drawer when concert is selected
      state.isDrawerOpen = true
      state.loading = true
    },
    // Success
    [fetchSelectedConcert.fulfilled.type]: (
      state,
      action: PayloadAction<SelectedConcert>
    ) => {
      state.selectedConcert = action.payload
      state.loading = false
    },
    // Error
    [fetchSelectedConcert.rejected.type]: (state, action) => {
      // show error toast on error?
      state.error = action.error
      state.loading = false
    },
  },
})

export const { toggleConcertDrawer } = selectedConcertSlice.actions

export default selectedConcertSlice.reducer
