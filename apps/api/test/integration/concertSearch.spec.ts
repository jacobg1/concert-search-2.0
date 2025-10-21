import { INestApplicationContext } from '@nestjs/common'
import nock from 'nock'
import { concertList, singleConcert } from '@repo/mock-data/pre-api'
import { AppModule } from '../../src/app.module'
import { ConcertService } from '../../src/services'
import {
  bootstrap,
  getApiBaseUrl,
  getMockInput,
  testConcertList,
  testSingleConcert,
} from '../utils'

const mockConcertId = '2'
const mockSearchTerm = 'testing'

describe('Concert Search Integration', () => {
  let app: INestApplicationContext
  let concertService: ConcertService

  beforeAll(() => {
    nock.disableNetConnect()
    jest.restoreAllMocks()
  })

  beforeEach(async () => {
    app = await bootstrap(AppModule)
    concertService = app.get(ConcertService)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.enableNetConnect()
  })

  it('concertService properly initializes', () => {
    expect(concertService).toBeDefined()
    expect(concertService).toBeInstanceOf(ConcertService)
  })

  it('getConcertList returns the correct response', async () => {
    nock(getApiBaseUrl())
      .get('/advancedsearch.php')
      .query(({ q }) => !!q?.includes(mockSearchTerm))
      .reply(200, concertList)

    const resp = await concertService.getConcertList({
      body: getMockInput(mockSearchTerm),
    })

    testConcertList(resp)
  })

  it('getSingleConcert returns the correct response', async () => {
    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(200, singleConcert)

    const resp = await concertService.getSingleConcert({
      pathParameters: { id: mockConcertId },
    })

    testSingleConcert(resp)
  })
})
