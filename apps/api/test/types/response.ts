import { HttpStatus } from '@nestjs/common'

export interface ExpectedResponse {
  expectedBody?: Record<string, string>
  expectedStatusCode: HttpStatus
  expectedHeaders: Record<string, string | number | boolean>
}
