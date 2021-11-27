import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

interface SingleConcertMeta {
  description: string
  identifier: string
  mediatype: string
  title: string
  year: number
}

type ChunkedConcertList = SingleConcertMeta[][]

interface ConcertListState {
  concerts: ChunkedConcertList
  loading: boolean
  error: Error | Record<string, unknown>
}

export const fetchConcertList = createAsyncThunk(
  'concertList/fetchConcertList',
  async (query: Record<string, string>) => {
    const { bandName, year } = query
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/meta/${bandName}/${year}`,
      {
        method: 'GET',
      }
    )
    return response.json() as Promise<ChunkedConcertList>
  }
)

const initialState: ConcertListState = {
  concerts: [],
  loading: false,
  error: {},
}

const concertListSlice = createSlice({
  name: 'concertList',
  initialState,
  reducers: {},
  extraReducers: {
    // Loading
    [fetchConcertList.pending.type]: (state) => {
      state.loading = true
    },
    // Success
    [fetchConcertList.fulfilled.type]: (
      state,
      action: PayloadAction<ChunkedConcertList>
    ) => {
      state.concerts = action.payload
      state.loading = false
    },
    // Error
    [fetchConcertList.rejected.type]: (state, action) => {
      // show error toast on error?
      state.error = action.error
      state.loading = false
    },
  },
})

export default concertListSlice.reducer
