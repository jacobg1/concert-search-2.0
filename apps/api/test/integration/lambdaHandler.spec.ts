import nock from 'nock'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { concertList, singleConcert } from '@repo/mock-data/pre-api'
import { createMockEvent, createMockContext } from '@repo/mock-data/event'
import {
  getApiBaseUrl,
  getMockInput,
  testSingleConcert,
  testLambdaResponse,
  testConcertList,
  expectedHeaders,
  expectedErrorHeaders,
} from '../utils'
import { handler } from '../../src/main'
import type { ConcertData, PaginatedConcertList } from '../../src/interface'
import { HttpStatus, Logger } from '@nestjs/common'
import type { TestLambdaResponse } from '../types'

const mockConcertId = '001'
const mockSearchTerm = 'handler test'
const concertsRoute = '/concerts'

const mockContext = createMockContext()
const mockCallback = () => null

const errorLogMock = jest.spyOn(Logger, 'error')

describe('Lambda Handler Integration', () => {
  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  afterAll(() => {
    jest.restoreAllMocks()
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
    )) as TestLambdaResponse

    testLambdaResponse(response, {
      expectedStatusCode: HttpStatus.OK,
      expectedHeaders,
    })

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
    )) as TestLambdaResponse

    testLambdaResponse(response, {
      expectedStatusCode: HttpStatus.OK,
      expectedHeaders,
    })

    if (!response.body) {
      throw new Error('Invalid handler response body')
    }

    const concertData = JSON.parse(response.body) as ConcertData

    testSingleConcert(concertData)
  })

  it('lambda handler throws error if input is invalid', async () => {
    errorLogMock.mockReturnThis()

    const response = (await handler(
      {} as APIGatewayProxyEventV2,
      mockContext,
      mockCallback
    )) as TestLambdaResponse

    testLambdaResponse(response, {
      expectedStatusCode: HttpStatus.NOT_FOUND,
      expectedHeaders: expectedErrorHeaders,
      expectedBody: { message: 'Invalid request' },
    })

    expect(errorLogMock).toHaveBeenCalledTimes(1)
  })

  it('lambda handler throws an error if route is not found', async () => {
    errorLogMock.mockReturnThis()

    const mockEvent = createMockEvent({
      method: 'POST',
      route: '/invalid/route',
      path: concertsRoute,
      body: getMockInput(mockSearchTerm),
    })

    const response = (await handler(
      mockEvent,
      mockContext,
      mockCallback
    )) as TestLambdaResponse

    testLambdaResponse(response, {
      expectedStatusCode: HttpStatus.NOT_FOUND,
      expectedHeaders: expectedErrorHeaders,
      expectedBody: { message: 'Not found' },
    })

    expect(errorLogMock).toHaveBeenCalledTimes(1)
  })
})
