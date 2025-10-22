import { HttpStatus } from '@nestjs/common'

export interface TestError {
  message?: string
  statusCode: number
}

export interface ExpectedResponse {
  expectedBody?: Record<string, string>
  expectedStatusCode: HttpStatus
  expectedHeaders: Record<string, string | number | boolean>
}

export interface ExpectedException {
  msg: string
  status: number
}
