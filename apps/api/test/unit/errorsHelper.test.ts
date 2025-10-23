import {
  testErrorInfo,
  expectedErrorString,
  testValidationErrors,
} from '../utils'
import { createErrorString, getErrorInfo } from '../../src/helpers'
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import type { InvalidErrors } from '../types'

const defaultErrorMessage = 'Unknown Application Error'
const defaultError = 'Internal Server Error'
const notFoundError = 'Not found error'

describe('Error Helper Tests', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('getErrorInfo returns http exception info', () => {
    const testError = new NotFoundException(notFoundError)

    testErrorInfo(getErrorInfo(testError), {
      msg: notFoundError,
      status: HttpStatus.NOT_FOUND,
    })
  })

  it('getErrorInfo returns default info for non http exceptions', () => {
    const testError = new Error('Test error')

    testErrorInfo(getErrorInfo(testError), {
      msg: defaultError,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  })

  it('getErrorInfo returns default error if logic fails', () => {
    const testError = new BadRequestException('Invalid Request')

    const getResponseMock = jest.fn()
    testError.getResponse = getResponseMock

    getResponseMock.mockImplementation(() => {
      throw new Error('Method failed')
    })

    testErrorInfo(getErrorInfo(testError), {
      msg: defaultError,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })

    expect(getResponseMock).toHaveBeenCalledTimes(1)
  })

  it('getErrorInfo returns default error message when necessary', () => {
    const testError = new NotFoundException(notFoundError)

    const getResponseMock = jest.fn()
    testError.getResponse = getResponseMock

    const testErrorResponses = ['string message', { invalid: true }, undefined]

    for (const response of testErrorResponses) {
      getResponseMock.mockReturnValue(response)

      testErrorInfo(getErrorInfo(testError), {
        msg: defaultErrorMessage,
        status: HttpStatus.NOT_FOUND,
      })

      expect(getResponseMock).toHaveBeenCalledTimes(1)
      getResponseMock.mockClear()
    }
  })

  it('createErrorString works properly', () => {
    const errorString = createErrorString(testValidationErrors)
    expect(errorString).toBe(expectedErrorString)
  })

  it('createErrorString handles errors properly', () => {
    const defaultValidationError = 'Bad Request'

    const invalidErrors = [
      undefined,
      [],
      [{ constraints: {} }],
    ] as InvalidErrors

    for (const validationError of invalidErrors) {
      const errorString = createErrorString(validationError)
      expect(errorString).toBe(defaultValidationError)
    }
  })
})
