import { HttpStatus, Logger } from '@nestjs/common'
import { createMockContext, createMockEvent } from '@repo/mock-data/event'
import { concertList, singleConcert } from '@repo/mock-data/pre-api'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import nock from 'nock'
import type { ConcertData, PaginatedConcertList } from '../../src/interface'
import { handler } from '../../src/main'
import { mockServer } from '../../src/mocks/node'
import { offline } from '../../src/mocks/offline'
import type { TestLambdaResponse } from '../types'
import {
  expectedErrorHeaders,
  expectedHeaders,
  getApiBaseUrl,
  getMockInput,
  testConcertList,
  testLambdaResponse,
  testSingleConcert,
} from '../utils'

const mockConcertId = '001'
const mockSearchTerm = 'handler test'
const concertsRoute = '/concerts'
const singleConcertRoute = '/concerts/{id}'

const mockContext = createMockContext()
const mockCallback = () => null

const errorLogMock = jest.spyOn(Logger, 'error')

const serverListenMock = jest.spyOn(mockServer, 'listen')
const offlineListenMock = jest.spyOn(offline, 'listen')

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
      route: singleConcertRoute,
      path: `${concertsRoute}/${mockConcertId}`,
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

  it('mock lambda handler returns proper response', async () => {
    const { handler: mockHandler } = await import('../../src/mocks/mockMain')

    serverListenMock.mockReturnThis()
    offlineListenMock.mockReturnThis()

    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(200, singleConcert)

    const mockEvent = createMockEvent({
      method: 'GET',
      route: `${concertsRoute}/{id}`,
      path: `${concertsRoute}/${mockConcertId}`,
      pathParameters: { id: mockConcertId },
    })

    const response = (await mockHandler(
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

    expect(serverListenMock).toHaveBeenCalledTimes(1)
    expect(offlineListenMock).toHaveBeenCalledTimes(1)
  })
})
