import nock from 'nock'
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { concertList, singleConcert } from '@repo/mock-data/pre-api'
import { createMockEvent, createMockContext } from '@repo/mock-data/event'
import {
  getApiBaseUrl,
  getMockInput,
  testSingleConcert,
  testLambdaResponse,
  testConcertList,
} from '../utils'
import { handler } from '../../src/main'
import type { ConcertData, PaginatedConcertList } from '../../src/interface'

const mockConcertId = '001'
const mockSearchTerm = 'handler test'
const concertsRoute = '/concerts'

const mockContext = createMockContext()
const mockCallback = () => null

describe('Lambda Handler Integration', () => {
  beforeAll(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('lambda handler can get a list of concerts', async () => {
    nock(getApiBaseUrl())
      .get('/advancedsearch.php')
      .query(({ q }) => !!q?.includes(mockSearchTerm))
      .reply(200, concertList)

    const mockEvent = createMockEvent({
      method: 'POST',
      route: concertsRoute,
      path: concertsRoute,
      body: getMockInput(mockSearchTerm),
    })

    const response = (await handler(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyStructuredResultV2

    testLambdaResponse(response)

    if (!response.body) {
      throw new Error('Invalid handler response body')
    }

    const concertListData = JSON.parse(response.body) as PaginatedConcertList

    testConcertList(concertListData)
  })

  it('lambda handler can get a single concert', async () => {
    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(200, singleConcert)

    const mockEvent = createMockEvent({
      method: 'GET',
      route: `${concertsRoute}/{id}`,
      path: concertsRoute,
      pathParameters: { id: mockConcertId },
    })

    const response = (await handler(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyStructuredResultV2

    testLambdaResponse(response)

    if (!response.body) {
      throw new Error('Invalid handler response body')
    }

    const concertData = JSON.parse(response.body) as ConcertData

    testSingleConcert(concertData)
  })
})
