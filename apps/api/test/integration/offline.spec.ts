import { HttpStatus } from '@nestjs/common'
import { concertList, singleConcert } from '@repo/mock-data/pre-api'
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { HttpMethods } from 'msw'
import nock from 'nock'
import * as main from '../../src/main'
import { jsonContent } from '../../src/mocks/config'
import { offline } from '../../src/mocks/offline'
import {
  getApiBaseUrl,
  getMockInput,
  testConcertList,
  testOfflineResponse,
  testSingleConcert
} from '../../test/utils'

const mockConcertId = '001'
const mockSearchTerm = 'offline test'
const offlinePort = 3007
const offlineUrl = `http://localhost:${offlinePort}`

// TODO  - Fix linter warnings in this file (npm run lint)
describe('Offline Api Integration', () => {
  let api: ReturnType<typeof offline.listen>

  beforeAll((done) => {
    api = offline.listen(offlinePort, () => done())
  })

  afterAll((done) => {
    api.close(() => done())
  })

  afterEach(() => {
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  it('Offline api returns the correct concert list', async () => {
    nock(getApiBaseUrl())
      .get('/advancedsearch.php')
      .query(({ q }) => !!q?.includes(mockSearchTerm))
      .reply(HttpStatus.OK, concertList)

    const response = await fetch(
      `${offlineUrl}/concerts`,
      {
        method: HttpMethods.POST,
        headers: jsonContent,
        body: JSON.stringify(getMockInput(mockSearchTerm)),
      }
    )

    testOfflineResponse(response, true)
    testConcertList(await response.json())
  })

  it('Offline api returns the correct individual concert', async () => {
    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(HttpStatus.OK, singleConcert)

    const response = await fetch(
      `${offlineUrl}/concerts/${mockConcertId}`,
      {
        method: HttpMethods.GET,
      }
    )

    testOfflineResponse(response, true)
    testSingleConcert(await response.json())
  })

  it('Offline api throws an error if route is not found', async () => {
    const mockLog = jest.spyOn(console, 'log')
    mockLog.mockReturnThis()

    const response = await fetch(
      `${offlineUrl}/invalid/${mockConcertId}`,
      {
        method: HttpMethods.GET,
      }
    )

    testOfflineResponse(response, false)
    expect(mockLog).toHaveBeenCalled()
  })

  it('Offline api properly handles no return value from lambda handler', async () => {
    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(HttpStatus.OK, singleConcert)

    const handlerSpy = jest.spyOn(main, 'handler')
    handlerSpy.mockImplementation(() => undefined)

    const response = await fetch(
      `${offlineUrl}/concerts/${mockConcertId}`,
      {
        method: HttpMethods.GET,
      }
    )

    testOfflineResponse(response, true)
    expect(await response.text()).toBeFalsy()
  })

  it('Offline api properly handles string returned from lambda handler', async () => {
    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(HttpStatus.OK, singleConcert)

    const handlerSpy = jest.spyOn(main, 'handler')
    const testResponse = "1234567"

    handlerSpy.mockResolvedValue(testResponse)

    const response = await fetch(
      `${offlineUrl}/concerts/${mockConcertId}`,
      {
        method: HttpMethods.GET,
      }
    )

    testOfflineResponse(response, true)
    expect(await response.text()).toBe(testResponse)
  })

  it('Offline api throws an error if lambda response format is incorrect', async () => {
    nock(getApiBaseUrl())
      .get('/advancedsearch.php')
      .query(({ q }) => !!q?.includes(mockSearchTerm))
      .reply(HttpStatus.OK, concertList)

    const handlerSpy = jest.spyOn(main, 'handler')
    const mockLog = jest.spyOn(console, 'log')

    handlerSpy.mockResolvedValue({ data: { test: true } } as APIGatewayProxyStructuredResultV2)
    mockLog.mockReturnThis()

    const response = await fetch(
      `${offlineUrl}/concerts`,
      {
        method: HttpMethods.POST,
        headers: jsonContent,
        body: JSON.stringify(getMockInput(mockSearchTerm)),
      }
    )

    testOfflineResponse(response, false)
    expect(mockLog).toHaveBeenCalled()
  })

  it('Offline Api OPTIONS method returns a response and cors headers', async () => {
    const response = await fetch(
      `${offlineUrl}/concerts/${mockConcertId}`,
      {
        method: HttpMethods.OPTIONS,
      }
    )
    testOfflineResponse(response, true)
  })
})
