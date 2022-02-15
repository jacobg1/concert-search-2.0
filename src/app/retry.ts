import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { fetchConcertList } from '../features/concerts/concertListSlice'
import { AppDispatch, RootState } from './store'

// Not in use anymore since deploying app to elastic beanstalk
// Retry initial search twice if lambda is sleeping
let tries = 0
const extraTries = 2
export const retry: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (action.type === 'concertList/fetchConcertList/rejected') {
      tries += 1
      if (tries <= extraTries) {
        return store.dispatch(fetchConcertList(action.meta.arg))
      }
    }
    return next(action)
  }
