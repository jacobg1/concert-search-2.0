import type {
  MockPathParams,
  CreateMockEventContextInput,
  CreateMockEventInput,
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

function createMockEventContext({
  method,
  rawPath,
  routeKey,
}: CreateMockEventContextInput) {
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
    },
    operationName: undefined,
    requestId: 'offlineContext_resourceId',
    routeKey,
    stage: '$default',
    time: '20/Oct/2025:12:38:52',
    timeEpoch: 1234567891012,
  }
}

export function createMockEvent({
  path,
  route,
  method,
  pathParameters,
  body,
}: CreateMockEventInput) {
  const rawPath = pathParameters ? createMockPath(path, pathParameters) : path
  const mockBody = body ? JSON.stringify(body) : null
  const routeKey = `${method} ${route}`
  const mockEventContext = createMockEventContext({ method, rawPath, routeKey })

  return {
    cookies: [],
    isBase64Encoded: false,
    queryStringParameters: null,
    rawQueryString: '',
    rawPath,
    pathParameters: pathParameters ?? null,
    headers: mockHeaders,
    body: mockBody,
    requestContext: mockEventContext,
    routeKey,
    stageVariables: null,
    version: '2.0',
  }
}
