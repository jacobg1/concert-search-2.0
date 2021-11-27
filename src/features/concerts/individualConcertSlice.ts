import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { TrackList, TrackMetaData } from '../tracks/trackInterface'

interface IndividualConcert {
  metaData?: TrackMetaData
  trackList?: TrackList[]
}

export const fetchIndividualConcert = createAsyncThunk(
  'individualConcert/fetchIndividualConcert',
  async (concertId: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/concert/${concertId}`,
      {
        method: 'GET',
      }
    )
    return response.json() as Promise<IndividualConcert>
  }
)

interface IndividualConcertState {
  individualConcert: IndividualConcert
  loading: boolean
  error: Error | Record<string, unknown>
}

const initialState: IndividualConcertState = {
  individualConcert: {},
  loading: false,
  error: {},
}

const individualConcertSlice = createSlice({
  name: 'individualConcert',
  initialState,
  reducers: {},
  extraReducers: {
    // Loading
    [fetchIndividualConcert.pending.type]: (state) => {
      state.loading = true
    },
    // Success
    [fetchIndividualConcert.fulfilled.type]: (
      state,
      action: PayloadAction<IndividualConcert>
    ) => {
      state.individualConcert = action.payload
      state.loading = false
    },
    // Error
    [fetchIndividualConcert.rejected.type]: (state, action) => {
      // show error toast on error?
      state.error = action.error
      state.loading = false
    },
  },
})

export default individualConcertSlice.reducer
