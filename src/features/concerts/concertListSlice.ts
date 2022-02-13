import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit'
import {
  ChunkedConcertList,
  SearchParams,
  ConcertListState,
  SearchBody,
} from './concertListInterface'

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

    const { bandName, year, filterDuplicates } = query

    const body: SearchBody = {
      searchTerm: year ? `${bandName}+AND+year%3A${year}` : bandName,
      max: 1000,
      sortBy: { date: 'desc', downloads: 'desc' },
      filterDuplicates,
    }

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/concerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    return response.json() as Promise<ChunkedConcertList>
  },
  {
    condition: (query, { getState }) => {
      const {
        concertList: { concertQuery },
      } = getState()
      return !Object.values(query).every(
        (val) => Object.values(concertQuery).indexOf(val) !== -1
      )
    },
  }
)

const initialState: ConcertListState = {
  concerts: [],
  concertQuery: { bandName: '', year: '', filterDuplicates: true },
  loading: false,
  error: {},
  pageNumber: 1,
}

const concertListSlice = createSlice({
  name: 'concertList',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload
    },
    setBandAndYear: (state, action: PayloadAction<SearchParams>) => {
      state.concertQuery = action.payload
    },
  },
  extraReducers: {
    // Loading
    [fetchConcertList.pending.type]: (state) => {
      // Reset pagination
      state.pageNumber = 1
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
    [fetchConcertList.rejected.type]: (
      state,
      action: { error: SerializedError }
    ) => {
      // show error toast on error?
      state.error = action.error
      state.loading = false
    },
  },
})

export const { setPageNumber, setBandAndYear } = concertListSlice.actions
export default concertListSlice.reducer
