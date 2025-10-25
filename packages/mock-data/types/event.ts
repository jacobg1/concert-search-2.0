import type { APIGatewayProxyEventV2, Context } from 'aws-lambda'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type MockPathParams = Record<string, string | undefined>

export interface CreateMockEventInput {
  path: string
  route: string
  method: HttpMethod
  pathParameters?: MockPathParams
  queryStringParameters?: MockPathParams
  body?: unknown
}

export interface CreateMockRequestContextInput
  extends Pick<CreateMockEventInput, 'method'> {
  rawPath: string
  routeKey: string
}

export type CreateMockEventFunc = (
  args: CreateMockEventInput
) => APIGatewayProxyEventV2

export type CreateMockContextFunc = () => Context
