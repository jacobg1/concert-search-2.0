import {
  expectedErrorHeaders,
  expectedHeaders,
  getMockInput,
  testException,
  testLambdaResponse,
} from '../utils'
import { extractReqData, handleResponse, handleError } from '../../src/helpers'
import { createMockEvent } from '@repo/mock-data/event'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { BadRequestException, HttpStatus } from '@nestjs/common'

const mockConcertId = '001'
const mockSearchTerm = 'handler test'
const concertsRoute = '/concerts'

const mockPathInput = { id: mockConcertId }

describe('Request Format Helper Tests', () => {
  it('extractReqData works properly', () => {
    const resultOne = extractReqData(
      createMockEvent({
        method: 'GET',
        route: `${concertsRoute}/{id}`,
        path: concertsRoute,
        pathParameters: mockPathInput,
        queryStringParameters: mockPathInput,
      })
    )

    expect(resultOne.body).not.toBeDefined()
    expect(resultOne.pathParameters).toEqual(mockPathInput)
    expect(resultOne.queryStringParameters).toEqual(mockPathInput)

    const mockInput = getMockInput(mockSearchTerm)

    const resultTwo = extractReqData(
      createMockEvent({
        method: 'POST',
        route: concertsRoute,
        path: concertsRoute,
        body: mockInput,
      })
    )

    expect(resultTwo.pathParameters).not.toBeDefined()
    expect(resultTwo.queryStringParameters).not.toBeDefined()
    expect(resultTwo.body).toEqual(mockInput)

    const invalidInput = {
      body: mockInput,
    } as unknown as APIGatewayProxyEventV2

    let testError: unknown

    try {
      extractReqData(invalidInput)
    } catch (err: unknown) {
      testError = err
    }

    testException(testError, BadRequestException, {
      msg: 'Invalid request body',
      status: 400,
    })
  })

  it('handleResponse works properly', () => {
    const mockBody = { test: '123' }
    const response = handleResponse(mockBody)

    testLambdaResponse(response, {
      expectedStatusCode: HttpStatus.OK,
      expectedHeaders: expectedHeaders,
      expectedBody: mockBody,
    })
  })

  it('handleError works properly', () => {
    const errorMessage = 'Test error'
    const errorBody = { message: errorMessage }
    const testError = handleError(new BadRequestException(errorMessage))

    testLambdaResponse(testError, {
      expectedStatusCode: HttpStatus.BAD_REQUEST,
      expectedHeaders: expectedErrorHeaders,
      expectedBody: errorBody,
    })
  })
})
