import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import concertListReducer from '../features/concerts/concertListSlice'
import individualConcertReducer from '../features/selectedConcert/selectedConcertSlice'
import concertSelectReducer from '../features/concertSelect/concertSelectSlice'

export const store = configureStore({
  reducer: {
    individualConcert: individualConcertReducer,
    concertList: concertListReducer,
    concertSelect: concertSelectReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
