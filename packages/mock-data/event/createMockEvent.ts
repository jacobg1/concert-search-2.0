import type {
  MockPathParams,
  CreateMockRequestContextInput,
  CreateMockEventFunc,
  CreateMockContextFunc,
} from '../types'

const mockHeaders = {
  host: 'localhost:3000',
  connection: 'keep-alive',
  accept: '*/*',
  origin: 'http://localhost:8080',
  referer: 'http://localhost:8080/',
}

function createMockPath(mockPath: string, mockPathParams: MockPathParams) {
  const createPathFromParams = Object.values(mockPathParams).reduce(
    (acc, curr, index, self) => {
      const sep = index !== self.length - 1 ? '/' : ''
      return (acc += curr + sep)
    },
    ''
  )
  return `${mockPath}/${createPathFromParams}`
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

export const createMockEvent: CreateMockEventFunc = ({
  path,
  route,
  method,
  pathParameters,
  queryStringParameters,
  body,
}) => {
  const rawPath = pathParameters ? createMockPath(path, pathParameters) : path
  const mockBody = body ? JSON.stringify(body) : null
  const routeKey = `${method} ${route}`
  const mockRequestContext = createMockRequestContext({
    method,
    rawPath,
    routeKey,
  })

  return {
    ...(pathParameters && { pathParameters }),
    ...(queryStringParameters && { queryStringParameters }),
    ...(mockBody && { body: mockBody }),
    headers: mockHeaders,
    requestContext: mockRequestContext,
    routeKey,
    rawPath,
    cookies: [],
    isBase64Encoded: false,
    rawQueryString: '',
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
