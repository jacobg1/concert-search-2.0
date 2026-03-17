import type { HttpMethod } from '@repo/mock-data/types'
import type { Request } from 'express'

export interface OfflineConfig {
  route: string,
  lambdaRoute: string,
  method: HttpMethod
}

export interface OfflineParams {
  body?: Record<string, unknown>,
  query?: Request['query'],
  params?: Record<string, string>
}
