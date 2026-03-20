import type { HttpMethod } from '@repo/mock-data/types'
import type { Request } from 'express'
import type { ConcertSearchOptions } from './concerts.interface'

export interface OfflineConfig {
  configPath: string,
  lambdaRoute: string,
  method: HttpMethod
}

export interface OfflineParams {
  body?: ConcertSearchOptions,
  query?: Request['query'],
  params?: Record<string, string>
}
