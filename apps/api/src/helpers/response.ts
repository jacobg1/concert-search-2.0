import { HttpStatus } from '@nestjs/common'
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { getErrorInfo } from './errors'

export function handleResponse(
  body: unknown
): APIGatewayProxyStructuredResultV2 {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: HttpStatus.OK,
  }
}

export function handleError(error: unknown): APIGatewayProxyStructuredResultV2 {
  const { statusCode, message } = getErrorInfo(error)

  return {
    statusCode,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json',
      'x-amzn-ErrorType': 'Error',
    },
    body: JSON.stringify({ message }),
  }
}
