import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { TrackList, TrackMetaData } from '../tracks/trackInterface'

interface SelectedConcert {
  metaData?: TrackMetaData
  trackList?: TrackList[]
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
  loading: boolean
  error: Error | Record<string, unknown>
}

const initialState: SelectedConcertState = {
  selectedConcert: {},
  loading: false,
  error: {},
}

const selectedConcertSlice = createSlice({
  name: 'selectedConcert',
  initialState,
  reducers: {},
  extraReducers: {
    // Loading
    [fetchSelectedConcert.pending.type]: (state) => {
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

export default selectedConcertSlice.reducer
