import { http, HttpResponse } from 'msw'
import { singleConcert } from './data/singleConcertResponse'
import { concertList } from './data/concertListResponse'

function getUrl(url?: string): string {
  if (!url) throw new Error('missing mock url')
  return url
}

export const handlers = [
  http.get(getUrl(process.env.METADATA_URL), () => {
    return HttpResponse.json(singleConcert)
  }),
  http.get(getUrl(process.env.ADVANCED_SEARCH_URL), () => {
    return HttpResponse.json(concertList)
  }),
]
