import { HttpStatus } from '@nestjs/common'

export function handleResponse(body) {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: HttpStatus.OK,
  }
}

export function handleError(error) {
  const errorMessage = error?.message || 'Internal Server Error'

  return {
    statusCode: error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json',
      'x-amzn-ErrorType': 'Error',
    },
    body: JSON.stringify({ message: errorMessage || 'Request Failed' }),
  }
}
