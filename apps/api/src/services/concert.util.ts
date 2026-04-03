import { BadRequestException } from '@nestjs/common'
import chunk from 'lodash.chunk'
import type {
  BaseSearchOptions,
  DateLookupObj,
  FilterParams,
  PaginatedConcertList,
  SearchResponse,
  SingleConcert,
  TrackListData,
} from '../interface'
import { MediaFormat } from '../interface'

export const baseOptions: BaseSearchOptions = {
  searchBy: 'creator',
  fields: [
    'date',
    'description',
    'format',
    'mediatype',
    'source',
    'title',
  ],
}

// This ensures that concerts will have requested formats sent from front-end
const isProperFormat = (
  concertFormats: MediaFormat[],
  mediaFormat: MediaFormat[]
) => {
  return mediaFormat.some((format) => concertFormats.includes(format))
}

// Apply filters from front-end and paginate
export function paginateResponse(
  searchResponse: SearchResponse,
  { filterDuplicates, mediaFormat }: FilterParams
): PaginatedConcertList {
  const dateLookup: DateLookupObj = {}

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

// TODO - find solution that doesn't involve updating concert service's code
export function formatFilesDevelopment(
  files: TrackListData[]
): TrackListData[] {
  return files.reduce((acc: TrackListData[], curr: TrackListData) => {
    if (curr.format !== MediaFormat.MP3) return acc

    return [...acc, { ...curr, link: curr.link.replace('s', '') }]
  }, [])
}

export function formatFiles(files: TrackListData[]): TrackListData[] {
  if (process.env.NODE_ENV === 'development') {
    return formatFilesDevelopment(files)
  }

  // Filter for mp3 so that we don't send uneeded formats to front-end
  // We can switch formats by updating file name someId.mp3 => someId.ogg
  return files.filter((file) => file.format === MediaFormat.MP3)
}
