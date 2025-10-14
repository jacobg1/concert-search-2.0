import { archiveSearch } from 'archive-search'
import { BadRequestException, Injectable } from '@nestjs/common'
import { baseOptions, paginateResponse } from './concert.util'
import type {
  ConcertSearchOptions,
  SearchResponse,
  PaginatedConcertList,
  ConcertData,
  ArchiveSearchOptions,
  ConcertResponse,
} from '../interface'
import { MediaFormat } from '../interface'
import { ConcertValidator } from '../helpers'

const { MP3 } = MediaFormat

@Injectable()
export class ConcertService {
  async getConcertList(request: {
    body: ConcertSearchOptions
  }): Promise<PaginatedConcertList> {
    const concertValidator = new ConcertValidator()
    const validatedPayload = await concertValidator.transform(request.body)

    const { searchTerm, max, sortBy, ...rest } = validatedPayload

    const searchOptions: ArchiveSearchOptions = {
      ...baseOptions,
      max,
      sortBy,
    }

    const searchConcerts: SearchResponse = await archiveSearch.search(
      searchTerm,
      searchOptions
    )
    return paginateResponse(searchConcerts, rest)
  }

  async getSingleConcert(request): Promise<ConcertData> {
    const { id } = request.pathParameters

    if (!id) {
      throw new BadRequestException('Invalid request')
    }

    const concert: ConcertResponse = await archiveSearch.metaSearch(id)

    const { metadata, files } = concert

    return {
      metadata,
      // Filter for mp3 so that we don't send uneeded formats to front-end
      // We can switch formats by updating file name someId.mp3 => someId.ogg
      trackList: files.filter((file) => file.format === MP3),
    }
  }
}
