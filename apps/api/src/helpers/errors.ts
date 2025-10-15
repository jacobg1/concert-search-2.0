import { HttpStatus, HttpException } from '@nestjs/common'
import type { ErrorInfo } from '../interface'
import { ValidationError } from 'class-validator'

function mapErrorsToString(errors: ValidationError[]): string {
  return errors.reduce((acc, { constraints, children }) => {
    if (constraints) {
      const errorsArray = Object.values(constraints)
      if (errorsArray.length) acc += errorsArray.join(', ') + ', '
    }

    if (children?.length) acc += mapErrorsToString(children)

    return acc
  }, '')
}

export function createErrorString(errors: ValidationError[]): string {
  const defaultError = 'Bad Request'
  try {
    const errorString = mapErrorsToString(errors)
    if (errorString) {
      return errorString.replace(/, $/, '.')
    }
    return defaultError
  } catch {
    return defaultError
  }
}

const defaultError = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'Internal Server Error',
}

function getErrorMessage(resp?: string | object): string {
  if (!resp || typeof resp === 'string') {
    return defaultError.message
  }

  if ('message' in resp && typeof resp.message === 'string') {
    return resp.message
  }

  return defaultError.message
}

export function getErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof HttpException) {
    const statusCode = error.getStatus()
    const response = error.getResponse()

    return {
      statusCode,
      message: getErrorMessage(response),
    }
  }

  return defaultError
}
