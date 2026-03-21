import type { Request } from 'express'
import type {
  CreateMockContextFunc,
  CreateMockEventFunc,
  CreateMockRequestContextInput,
  LambdaQs,
  MockPathParams,
} from '../types'

const mockHeaders = {
  host: 'localhost:3000',
  connection: 'keep-alive',
  accept: '*/*',
  origin: 'http://localhost:8080',
  referer: 'http://localhost:8080/',
}

function createMockPath(mockPath: string, mockPathParams: MockPathParams): string {
  const splitPath = mockPath.split('/')

  return splitPath.reduce((acc, curr) => {
    if (!curr) return acc

    if (curr[0] === ':') {
      const key = curr.replace(':', '')
      acc += `/${mockPathParams[key]}`
    } else {
      acc += `/${curr}`
    }

    return acc
  }, '')
}

function createMockRequestContext({
  method,
  rawPath,
  routeKey,
}: CreateMockRequestContextInput) {
  return {
    accountId: 'offlineContext_accountId',
    apiId: 'offlineContext_apiId',
    domainName: 'offlineContext_domainName',
    domainPrefix: 'offlineContext_domainPrefix',
    http: {
      method,
      path: rawPath,
      protocol: 'HTTP/1.1',
      sourceIp: '127.0.0.1',
      userAgent: 'test-user-agent',
    },
    operationName: undefined,
    requestId: 'offlineContext_resourceId',
    routeKey,
    stage: '$default',
    time: '20/Oct/2025:12:38:52',
    timeEpoch: 1234567891012,
  }
}

function createRawQueryString(query?: Request['query']): string {
  if (!query) return ''

  return Object.entries(query).reduce((acc, [key, val], i) => {
    if (i !== 0) acc += '&'
    acc += `${key}=${val}`
    return acc
  }, '')
}

export const createMockEvent: CreateMockEventFunc = ({
  path,
  route,
  method,
  pathParameters,
  queryStringParameters,
  body,
}) => {
  const rawPath = pathParameters ? createMockPath(path, pathParameters) : path
  const rawQueryString = createRawQueryString(queryStringParameters)
  const mockBody = body ? JSON.stringify(body) : null
  const routeKey = `${method} ${route}`
  const mockRequestContext = createMockRequestContext({
    method,
    rawPath,
    routeKey,
  })

  return {
    ...(pathParameters && { pathParameters }),
    ...(queryStringParameters && { queryStringParameters } as LambdaQs),
    ...(mockBody && { body: mockBody }),
    headers: mockHeaders,
    requestContext: mockRequestContext,
    routeKey,
    rawPath,
    cookies: [],
    isBase64Encoded: false,
    rawQueryString,
    version: '2.0',
  }
}

export const createMockContext: CreateMockContextFunc = () => {
  return {
    awsRequestId: '4353645634634',
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'test',
    functionVersion: '$LATEST',
    invokedFunctionArn: 'offline_invokedFunctionArn_for_test',
    logGroupName: 'offline_logGroupName_for_test',
    logStreamName: 'offline_logStreamName_for_test',
    memoryLimitInMB: '5',
    done: () => null,
    fail: () => null,
    succeed: () => null,
    getRemainingTimeInMillis: () => 123,
  }
}
