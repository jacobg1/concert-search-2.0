type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type MockPathParams = Record<string, string | undefined>

export interface CreateMockEventInput {
  path: string
  route: string
  method: HttpMethod
  pathParameters?: MockPathParams
  body?: Record<string, unknown>
}

export interface CreateMockEventContextInput
  extends Pick<CreateMockEventInput, 'method'> {
  rawPath: string
  routeKey: string
}
