import { HttpMethods } from 'msw'
import type { OfflineConfig } from '../../src/interface'
import {
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

const mockConfig: OfflineConfig[] = [
  {
    route: '/mock/:testId',
    method: GET,
    lambdaRoute: '/mock/{testId}'
  },
  {
    route: '/mock',
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
      getPathParams(firstMock.route, mockRouteParams)
    ).toStrictEqual({ testId: expectedId })
  })

  it('createOfflineEvent creates the correct event', () => {
    const mockInput = getMockInput('util test')
    const { route, method, lambdaRoute } = secondMock

    const {
      body,
      rawPath,
      routeKey,
      requestContext: { http }
    } = createOfflineEvent(
      { method, route, lambdaRoute },
      { body: mockInput }
    )

    const parsedBody = JSON.parse(body as string)

    expect(body).toBeDefined()
    expect(parsedBody).toStrictEqual(mockInput)
    expect(routeKey).toBe(`${method} ${route}`)
    expect(rawPath).toBe(route)
    expect(http.method).toBe(method)
    expect(http.path).toBe(route)
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
})
