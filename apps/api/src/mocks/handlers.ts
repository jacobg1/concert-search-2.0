import { http, HttpResponse, type HttpHandler } from 'msw'
import { singleConcert, concertList } from '@repo/mock-data/pre-api'

function getUrl(url?: string): string {
  if (!url) throw new Error('missing mock url')
  return url
}

export const handlers: HttpHandler[] = [
  http.get(getUrl(process.env.METADATA_URL), () => {
    return HttpResponse.json(singleConcert)
  }),
  http.get(getUrl(process.env.ADVANCED_SEARCH_URL), () => {
    return HttpResponse.json(concertList)
  }),
]
