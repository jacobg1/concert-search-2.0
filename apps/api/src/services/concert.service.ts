import { archiveSearch } from 'archive-search'
import { BadRequestException, Injectable } from '@nestjs/common'
import { baseOptions, paginateResponse } from './concert.util'
import type {
  SearchResponse,
  PaginatedConcertList,
  ConcertData,
  ArchiveSearchOptions,
  ConcertResponse,
  IArchiveSearch,
  ConcertListInput,
  GetConcertInput,
} from '../interface'
import { MediaFormat } from '../interface'
import { ConcertValidator } from '../helpers'

const { MP3 } = MediaFormat

@Injectable()
export class ConcertService {
  async getConcertList({
    body,
  }: ConcertListInput): Promise<PaginatedConcertList> {
    if (!body) {
      throw new BadRequestException('Missing body in request')
    }

    const concertValidator = new ConcertValidator()
    const validatedPayload = await concertValidator.transform(body)

    const { searchTerm, max, sortBy, ...rest } = validatedPayload

    const searchOptions: ArchiveSearchOptions = {
      ...baseOptions,
      max,
      sortBy,
    }

    const searchConcerts: SearchResponse = await (
      archiveSearch as IArchiveSearch
    ).search(searchTerm, searchOptions)

    return paginateResponse(searchConcerts, rest)
  }

  async getSingleConcert({
    pathParameters,
  }: GetConcertInput): Promise<ConcertData> {
    const id = pathParameters?.id

    if (!id) {
      throw new BadRequestException('Invalid request')
    }

    const concert: ConcertResponse = await (
      archiveSearch as IArchiveSearch
    ).metaSearch(id)

    const { metadata, files } = concert

    return {
      metadata,
      // Filter for mp3 so that we don't send uneeded formats to front-end
      // We can switch formats by updating file name someId.mp3 => someId.ogg
      trackList: files.filter((file) => file.format === MP3),
    }
  }
}
