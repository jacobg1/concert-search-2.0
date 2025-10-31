import {
  type ThunkAction,
  type Action,
  configureStore,
  combineReducers,
} from '@reduxjs/toolkit'
import concertListReducer from '../features/concerts/concertListSlice'
import individualConcertReducer from '../features/selectedConcert/selectedConcertSlice'
import concertSelectReducer from '../features/concertSelect/concertSelectSlice'

const rootReducer = combineReducers({
  individualConcert: individualConcertReducer,
  concertList: concertListReducer,
  concertSelect: concertSelectReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
