import { BadRequestException, Injectable } from '@nestjs/common'
import { archiveSearch } from 'archive-search'
import { ConcertValidator } from '../helpers'
import type {
  ArchiveSearchOptions,
  ConcertData,
  ConcertListInput,
  ConcertResponse,
  GetConcertInput,
  PaginatedConcertList,
  SearchResponse,
} from '../interface'
import { formatFiles, baseOptions, paginateResponse } from './concert.util'

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

    const searchConcerts = (await archiveSearch.search(
      searchTerm,
      searchOptions
    )) as SearchResponse

    return paginateResponse(searchConcerts, rest)
  }

  async getSingleConcert({
    pathParameters,
  }: GetConcertInput): Promise<ConcertData> {
    const id = pathParameters?.id

    if (!id) {
      throw new BadRequestException('Invalid request')
    }

    const concert = (await archiveSearch.metaSearch(id)) as ConcertResponse

    const { metadata, files } = concert

    return {
      metadata,
      trackList: formatFiles(files),
    }
  }
}
