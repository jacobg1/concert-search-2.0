import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit'

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
  concertBand: string
  concertYear: string
  loading: boolean
  error: SerializedError
  pageNumber: number
}

interface SearchBody {
  searchTerm: string
  max: number
  sortBy: Record<string, string>
  filterDuplicates: boolean
}

export const fetchConcertList = createAsyncThunk<
  ChunkedConcertList,
  Record<string, string>,
  {
    state: { concertList: ConcertListState }
  }
>(
  'concertList/fetchConcertList',
  async (query, thunkApi) => {
    const { dispatch } = thunkApi

    dispatch(setBandAndYear(query))

    const { bandName, year } = query
    const searchTerm = year ? `${bandName}+AND+year%3A${year}` : bandName

    const body: SearchBody = {
      searchTerm,
      max: 1000,
      sortBy: { date: 'desc', downloads: 'desc' }, // downloads always should be desc
      filterDuplicates: true,
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
    condition: ({ bandName, year }, { getState }) => {
      const {
        concertList: { concertBand, concertYear },
      } = getState()
      if (bandName === concertBand && year === concertYear) {
        return false
      }

      return true
    },
  }
)

const initialState: ConcertListState = {
  concerts: [],
  concertBand: '',
  concertYear: '',
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
    setBandAndYear: (state, action: PayloadAction<{ [k: string]: string }>) => {
      state.concertBand = action.payload.bandName
      state.concertYear = action.payload.year
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
