import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { MediaFormat, NetworkError, SortOrder } from '../../app/interface'
import {
  ChunkedConcertList,
  SearchParams,
  ConcertListState,
  SearchBody,
} from './concertListInterface'

const { OGG, MP3 } = MediaFormat

export const fetchConcertList = createAsyncThunk<
  ChunkedConcertList,
  SearchParams,
  {
    state: { concertList: ConcertListState }
  }
>(
  'concertList/fetchConcertList',
  async (query, thunkApi) => {
    const { dispatch } = thunkApi
    dispatch(setBandAndYear(query))

    const { bandName, year, filterDuplicates, sortBy } = query

    const body: SearchBody = {
      searchTerm: year ? `${bandName}+AND+year%3A${year}` : bandName,
      max: 1000,
      filterDuplicates,
      sortBy,
      mediaFormat: [OGG, MP3],
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/concerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return response.json() as Promise<ChunkedConcertList>
    }
    return thunkApi.rejectWithValue((await response.json()) as NetworkError)
  },
  {
    condition: (query, { getState }) => {
      const {
        concertList: { concertQuery, error },
      } = getState()

      if (Object.keys(error).length) return true

      return !Object.values(query).every(
        (val) => Object.values(concertQuery).indexOf(val) !== -1
      )
    },
  }
)

const initialState: ConcertListState = {
  concerts: [],
  concertQuery: {
    bandName: '',
    year: '',
    filterDuplicates: true,
    sortBy: { downloads: SortOrder.DESC },
  },
  loading: false,
  error: {},
  pageNumber: 1,
}

const concertListSlice = createSlice({
  name: 'concertList',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload // Can mutate state here with ImmerJS
    },
    setBandAndYear: (state, action: PayloadAction<SearchParams>) => {
      state.concertQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConcertList.pending, (state) => {
        // Reset pagination
        state.pageNumber = 1
        state.loading = true
      })
      .addCase(
        fetchConcertList.fulfilled,
        (state, action: PayloadAction<ChunkedConcertList>) => {
          state.concerts = action.payload
          state.loading = false
        }
      )
      .addCase(fetchConcertList.rejected, (state, action) => {
        state.error = action.payload as NetworkError
        state.loading = false
      })
  },
})

export const { setPageNumber, setBandAndYear } = concertListSlice.actions
export default concertListSlice.reducer
