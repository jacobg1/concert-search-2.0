import { archiveSearch } from 'archive-search'
import { concertList, singleConcert } from '@repo/mock-data/post-api'
import { INestApplicationContext } from '@nestjs/common'
import { AppModule } from '../../src/app.module'
import { baseOptions, ConcertService } from '../../src/services'
import {
  bootstrap,
  getMockInput,
  testConcertList,
  testSingleConcert,
} from '../utils'

const mockSearch = jest.spyOn(archiveSearch, 'search')
const mockMetaSearch = jest.spyOn(archiveSearch, 'metaSearch')

const mockConcertId = '4'
const mockSearchTerm = 'TestSearch'

describe('ConcertService Unit Tests', () => {
  let app: INestApplicationContext
  let concertService: ConcertService

  beforeAll(() => {
    jest.mock('archive-search')
  })

  beforeEach(async () => {
    app = await bootstrap(AppModule)
    concertService = app.get(ConcertService)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('getConcertList properly retrieves a concert list', async () => {
    mockSearch.mockResolvedValue(concertList)

    const mockInput = getMockInput(mockSearchTerm)

    const resp = await concertService.getConcertList({
      body: getMockInput(mockSearchTerm),
    })

    expect(mockSearch).toHaveBeenCalledWith(mockSearchTerm, {
      ...baseOptions,
      max: mockInput.max,
      sortBy: mockInput.sortBy,
    })

    expect(resp.length).toBeGreaterThan(0)

    testConcertList(resp)
  })

  it('getSingleConcert properly retrieves a single concert', async () => {
    mockMetaSearch.mockResolvedValue(singleConcert)

    const resp = await concertService.getSingleConcert({
      pathParameters: { id: mockConcertId },
    })

    expect(mockMetaSearch).toHaveBeenCalledWith(mockConcertId)

    testSingleConcert(resp)
  })
})
