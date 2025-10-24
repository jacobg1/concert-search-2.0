import { concertList } from '@repo/mock-data/post-api'
import { paginateResponse } from '../../src/services'
import { MediaFormat, type SearchResponse } from '../../src/interface'
import { filterDuplicates3d, testConcertList, testException } from '../utils'
import { BadRequestException } from '@nestjs/common'

const duplicateConcertDate = '1994-10-01T00:00:00Z'
const list = concertList as SearchResponse

describe('Concert Util Test', () => {
  it('paginateResponse returns paginated concert list', () => {
    const paginatedResponse = paginateResponse(list, {
      filterDuplicates: true,
      mediaFormat: [MediaFormat.MP3, MediaFormat.OGG],
    })

    testConcertList(paginatedResponse)
  })

  it('filterDuplicates works properly', () => {
    for (const bool of [false, true]) {
      const paginatedResponse = paginateResponse(list, {
        filterDuplicates: bool,
        mediaFormat: [MediaFormat.MP3, MediaFormat.OGG],
      })

      const duplicates = filterDuplicates3d(
        paginatedResponse,
        'date',
        duplicateConcertDate
      )

      if (bool) {
        expect(duplicates.length).toBe(1)
      } else {
        expect(duplicates.length).toBeGreaterThan(1)
      }
    }
  })

  it('paginateResponse throws error if not results are found', () => {
    let testError: unknown

    try {
      paginateResponse({ docs: [] } as unknown as SearchResponse, {
        filterDuplicates: true,
        mediaFormat: [MediaFormat.MP3, MediaFormat.OGG],
      })
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: 'No results',
      status: 400,
    })
  })

  it('paginateResponse properly handles invalid media formats', () => {
    let testError: unknown

    try {
      paginateResponse(list, {
        filterDuplicates: false,
        mediaFormat: ['invalid_format' as MediaFormat],
      })
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: 'No results',
      status: 400,
    })
  })
})
