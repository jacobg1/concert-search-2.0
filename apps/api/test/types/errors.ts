import { ValidationError } from 'class-validator'

export interface TestError {
  message?: string
  statusCode: number
}

export interface ExpectedException {
  msg: string
  status: number
}

export type InvalidErrors = ValidationError[][]
