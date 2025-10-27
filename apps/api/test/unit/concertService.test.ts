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
  testException,
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

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('getConcertList properly retrieves a concert list', async () => {
    mockSearch.mockResolvedValue(concertList)

    const mockInput = getMockInput(mockSearchTerm)

    const resp = await concertService.getConcertList({
      body: mockInput,
    })

    expect(mockSearch).toHaveBeenCalledWith(mockSearchTerm, {
      ...baseOptions,
      max: mockInput.max,
      sortBy: mockInput.sortBy,
    })

    expect(resp.length).toBeGreaterThan(0)

    testConcertList(resp)
  })

  it('getConcertList throws an error if no body is defined', async () => {
    const expectedError = 'Missing body in request'

    mockSearch.mockReturnThis()

    let testError: unknown

    try {
      await concertService.getConcertList({
        body: undefined,
      })
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: expectedError,
      status: 400,
    })

    expect(mockSearch).not.toHaveBeenCalled()
  })

  it('getConcertList throws an error if api call fails', async () => {
    const expectedError = 'Request Failed'

    mockSearch.mockRejectedValue(new BadRequestException(expectedError))

    const mockInput = getMockInput(mockSearchTerm)

    let testError: unknown

    try {
      await concertService.getConcertList({
        body: mockInput,
      })
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: expectedError,
      status: 400,
    })

    expect(mockSearch).toHaveBeenCalledWith(mockSearchTerm, {
      ...baseOptions,
      max: mockInput.max,
      sortBy: mockInput.sortBy,
    })
  })

  it('getSingleConcert properly retrieves a single concert', async () => {
    mockMetaSearch.mockResolvedValue(singleConcert)

    const resp = await concertService.getSingleConcert({
      pathParameters: { id: mockConcertId },
    })

    expect(mockMetaSearch).toHaveBeenCalledWith(mockConcertId)

    testSingleConcert(resp)
  })

  it('getSingleConcert throws an error if no concert id is provided', async () => {
    let testError: unknown

    try {
      await concertService.getSingleConcert({
        pathParameters: { id: undefined },
      })
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: 'Invalid request',
      status: 400,
    })

    expect(mockMetaSearch).not.toHaveBeenCalled()
  })

  it('getSingleConcert throws an error if api call fails', async () => {
    const expectedError = 'Request Failed'

    mockMetaSearch.mockRejectedValue(new BadRequestException(expectedError))

    let testError: unknown

    try {
      await concertService.getSingleConcert({
        pathParameters: { id: mockConcertId },
      })
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: expectedError,
      status: 400,
    })

    expect(mockMetaSearch).toHaveBeenCalledWith(mockConcertId)
  })
})
