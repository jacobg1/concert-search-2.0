import { archiveSearch } from 'archive-search'
import { concertList, singleConcert } from '@repo/mock-data/post-api'
import { BadRequestException, INestApplicationContext } from '@nestjs/common'
import { AppModule } from '../../src/app.module'
import { baseOptions, ConcertService } from '../../src/services'
import {
  bootstrap,
  getMockInput,
  testConcertList,
  testSingleConcert,
} from '../utils'
import { getErrorInfo } from '../../src/helpers'

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

  it('getSingleConcert throws an error if no concert id is provided', async () => {
    mockMetaSearch.mockReturnThis()

    try {
      await concertService.getSingleConcert({
        pathParameters: { id: undefined },
      })
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(BadRequestException)

      const errorInfo = getErrorInfo(err)
      expect(errorInfo.statusCode).toBe(400)
      expect(errorInfo.message).toBe('Invalid request')
    }
  })
})
