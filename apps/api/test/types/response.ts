import { HttpStatus } from '@nestjs/common'
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'

export interface ExpectedResponse {
  expectedBody?: Record<string, string>
  expectedStatusCode: HttpStatus
  expectedHeaders: Record<string, string | number | boolean>
}

export type TestLambdaResponse = APIGatewayProxyStructuredResultV2
