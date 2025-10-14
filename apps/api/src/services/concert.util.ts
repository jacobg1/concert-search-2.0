import { BadRequestException } from '@nestjs/common'
import chunk from 'lodash.chunk'
import type {
  BaseSearchOptions,
  ConcertSearchOptions,
  PaginatedConcertList,
  SearchResponse,
  SingleConcert,
} from '../interface'
import { MediaFormat } from '../interface'

export const baseOptions: BaseSearchOptions = {
  searchBy: 'creator',
  fields: ['date', 'description', 'format', 'mediatype', 'source', 'title'],
}

// This ensures that concerts will have requested formats sent from front-end
const isProperFormat = (
  concertFormats: MediaFormat[],
  mediaFormat: MediaFormat[]
) => {
  return mediaFormat.some((format) => concertFormats.indexOf(format) !== -1)
}

type FilterParams = Pick<
  ConcertSearchOptions,
  'filterDuplicates' | 'mediaFormat'
>

// Apply filters from front-end and paginate
export function paginateResponse(
  searchResponse: SearchResponse,
  { filterDuplicates, mediaFormat }: FilterParams
): PaginatedConcertList {
  const dateLookup = {}

  const filterAndDedupe = searchResponse.docs.reduce<SingleConcert[]>(
    (acc, curr) => {
      if (filterDuplicates) {
        if (
          isProperFormat(curr.format, mediaFormat) &&
          !dateLookup[curr.date]
        ) {
          dateLookup[curr.date] = true
          return acc.concat(curr)
        }
        return acc
      }
      if (isProperFormat(curr.format, mediaFormat)) {
        return acc.concat(curr)
      }
      return acc
    },
    []
  )

  if (!filterAndDedupe.length) {
    throw new BadRequestException('No results')
  }

  return chunk(filterAndDedupe, 30)
}
