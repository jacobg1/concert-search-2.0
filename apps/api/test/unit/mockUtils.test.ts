import type { Request as ExpressRequest, NextFunction, Response } from 'express'
import { HttpMethods } from 'msw'
import type { OfflineConfig } from '../../src/interface'
import {
  allowCrossDomain,
  createOfflineEvent,
  findConfigUrl,
  getPathParams,
  logMockRequest,
} from '../../src/mocks/utils'
import { getMockInput } from '../utils'

const { GET, POST, DELETE } = HttpMethods

const mockConsoleLog = jest.spyOn(console, 'log')

const expectedId = '123'
const mockRouteParams = ['mock', expectedId]
const params = { testId: expectedId }

const mockConfig: OfflineConfig[] = [
  {
    configPath: '/mock/:testId',
    method: GET,
    lambdaRoute: '/mock/{testId}'
  },
  {
    configPath: '/mock',
    method: POST,
    lambdaRoute: '/mock'
  },
]

const [firstMock, secondMock] = mockConfig

describe('Mock Utils Tests', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('logMockRequest works properly', () => {
    const input = {
      request: {
        method: GET,
        url: 'test',
      } as Request,
    }

    mockConsoleLog.mockReturnThis()

    logMockRequest(input)

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'MSW intercepted:',
      input.request.method,
      input.request.url
    )
  })

  it('getPathParams returns the proper object', () => {
    expect(
      getPathParams(firstMock.configPath, mockRouteParams)
    ).toStrictEqual(params)
  })

  it('createOfflineEvent creates the correct event', () => {
    const mockInput = getMockInput('util test')
    const { configPath, method, lambdaRoute } = secondMock

    const {
      requestContext: { http, ...context },
      ...event
    } = createOfflineEvent(
      { method, configPath, lambdaRoute },
      { body: mockInput }
    )

    const parsedBody = JSON.parse(event.body as string)

    expect(event.body).toBeDefined()
    expect(parsedBody).toStrictEqual(mockInput)
    expect(event.routeKey).toBe(`${method} ${lambdaRoute}`)
    expect(context.routeKey).toBe(`${method} ${lambdaRoute}`)
    expect(event.rawPath).toBe(configPath)
    expect(http.method).toBe(method)
    expect(http.path).toBe(configPath)
  })

  it("createOfflineEvent properly handles path params and query string params", () => {
    const { configPath, method, lambdaRoute } = firstMock

    const testQuery = { test: '123', test2: '346', test3: '678' }
    const rawQuery = 'test=123&test2=346&test3=678'

    const expectedPath = `/mock/${expectedId}`

    const {
      requestContext: { http, ...context },
      ...event
    } = createOfflineEvent(
      { method, configPath, lambdaRoute },
      { query: testQuery, params }
    )

    expect(event.routeKey).toBe(`${method} ${lambdaRoute}`)
    expect(context.routeKey).toBe(`${method} ${lambdaRoute}`)
    expect(event.rawPath).toBe(expectedPath)
    expect(event.rawQueryString).toBe(rawQuery)
    expect(event.pathParameters).toStrictEqual(params)
    expect(event.queryStringParameters).toStrictEqual(testQuery)
    expect(http.method).toBe(method)
    expect(http.path).toBe(expectedPath)
  })

  it('findConfigUrl find the correct configuration entry', () => {
    expect(
      findConfigUrl(mockConfig, mockRouteParams, GET)
    ).toStrictEqual(firstMock)
  })

  it('findConfigUrl returns undefined if no match is found', () => {
    expect(
      findConfigUrl(mockConfig, ['invalid', expectedId], GET)
    ).toBeUndefined()

    expect(
      findConfigUrl(mockConfig, mockRouteParams, DELETE)
    ).toBeUndefined()

    expect(
      findConfigUrl(mockConfig, [...mockRouteParams, 'invalid'], GET)
    ).toBeUndefined()
  })

  it('allowCrossDomain sets the appropriate headers', () => {
    const setHeaderMock = jest.fn()
    const nextMock = jest.fn()
    const mockRes = { header: setHeaderMock }

    const middleware = allowCrossDomain()

    middleware(
      {} as ExpressRequest,
      mockRes as unknown as Response,
      nextMock as NextFunction
    )

    const expectedHeaders = [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ]

    for (const [i, header] of expectedHeaders.entries()) {
      expect(setHeaderMock).toHaveBeenNthCalledWith(i + 1, header, "*")
    }

    expect(nextMock).toHaveBeenCalled()
  })
})
