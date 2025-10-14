import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import type { RequestData } from '../interface'

const parseReqBody = (body: string): Record<string, any> => {
  try {
    return JSON.parse(body)
  } catch {
    throw new Error('Invalid request body')
  }
}

export const extractReqData = (
  event: APIGatewayProxyEventV2
): RequestData | Record<string, unknown> => {
  const { body, queryStringParameters, pathParameters } = event

  return {
    ...(body && { body: parseReqBody(body) }),
    ...(queryStringParameters && { queryStringParameters }),
    ...(pathParameters && { pathParameters }),
  }
}
