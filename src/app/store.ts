import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import concertListReducer from '../features/concerts/concertListSlice'
import individualConcertReducer from '../features/concerts/individualConcertSlice'
import concertSelectReducer from '../features/concertSelect/concertSelectSlice'

export const store = configureStore({
  reducer: {
    individualConcert: individualConcertReducer,
    concertList: concertListReducer,
    counter: counterReducer,
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
