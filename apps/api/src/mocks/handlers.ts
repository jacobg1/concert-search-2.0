import { http, HttpResponse } from 'msw'
import { singleConcert } from './data/singleConcertResponse'
import { concertList } from './data/concertListResponse'

export const handlers = [
  http.get(process.env.METADATA_URL, () => {
    return HttpResponse.json(singleConcert)
  }),
  http.get(process.env.ADVANCED_SEARCH_URL, () => {
    return HttpResponse.json(concertList)
  }),
]
