import type {
  Request as ExpressRequest,
  NextFunction,
  Response,
} from 'express'
import { HttpMethods } from 'msw'
import type {
  ConcertSearchOptions,
  OfflineConfig,
} from '../../src/interface'
import { cb } from '../../src/mocks/config'
import {
  allowCrossDomain,
  createOfflineEvent,
  findConfigUrl,
  getPathParams,
  handleMockAudio,
  logMockRequest,
} from '../../src/mocks/utils'
import { expectedCorsHeaders, getMockInput } from '../utils'
import path from 'path'

const { GET, POST, DELETE } = HttpMethods

const expectedId = '123'
const mockRouteParams = ['mock', expectedId]
const params = { testId: expectedId }

const mockConfig: OfflineConfig[] = [
  {
    configPath: '/mock/:testId',
    method: GET,
    lambdaRoute: '/mock/{testId}',
  },
  {
    configPath: '/mock',
    method: POST,
    lambdaRoute: '/mock',
  },
]

const [firstMock, secondMock] = mockConfig

describe('Mock Utils Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('logMockRequest works properly', () => {
    const mockConsoleLog = jest.spyOn(console, 'log')

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
      getPathParams(firstMock.configPath, `/mock/${expectedId}`)
    ).toEqual(params)

    expect(getPathParams(firstMock.configPath, `invalid route`)).toEqual(
      {}
    )
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

    if (!event.body) {
      throw new Error('Missing event body')
    }

    const parsedBody = JSON.parse(event.body) as ConcertSearchOptions

    expect(event.body).toBeDefined()
    expect(parsedBody).toStrictEqual(mockInput)
    expect(event.routeKey).toBe(`${method} ${lambdaRoute}`)
    expect(context.routeKey).toBe(`${method} ${lambdaRoute}`)
    expect(event.rawPath).toBe(configPath)
    expect(http.method).toBe(method)
    expect(http.path).toBe(configPath)
  })

  it('createOfflineEvent properly handles path params and query string params', () => {
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
    expect(findConfigUrl(mockConfig, mockRouteParams, GET)).toStrictEqual(
      firstMock
    )
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

    for (const [i, header] of expectedCorsHeaders.entries()) {
      expect(setHeaderMock).toHaveBeenNthCalledWith(i + 1, header, '*')
    }

    expect(nextMock).toHaveBeenCalled()
  })

  it('Mock callback works properly', () => {
    expect(cb()).toBeNull()
  })

  it('handleMockAudio calls next function if not dealing with a sound file', () => {
    const mockNext = jest.fn()
    const middleware = handleMockAudio()

    middleware(
      { path: '/test' } as ExpressRequest,
      {} as Response,
      mockNext as NextFunction
    )

    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('handleMockAudio works for both sound formats', () => {
    const mockSendFile = jest.fn<string, string[]>()
    const pathJoinSpy = jest.spyOn(path, 'join')

    const middleware = handleMockAudio()

    for (const [i, format] of ['mp3', 'ogg'].entries()) {
      const reqPath = `/sound/mock-audio.${format}`

      middleware(
        { path: reqPath } as ExpressRequest,
        { sendFile: mockSendFile } as unknown as Response,
        jest.fn() as NextFunction
      )

      expect(mockSendFile.mock.calls[i][0]).toContain(reqPath)
      expect(pathJoinSpy.mock.calls[i][1]).toBe(reqPath)
    }
  })
})
