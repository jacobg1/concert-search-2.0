import type { OfflineConfig } from '../../src/interface'

export const offlineConfig: OfflineConfig[] = [
  {
    configPath: '/concerts/:id',
    method: 'GET',
    lambdaRoute: '/concerts/{id}',
  },
  {
    configPath: '/concerts',
    method: 'POST',
    lambdaRoute: '/concerts',
  },
]

export const cb = () => null
export const jsonContent = { 'Content-Type': 'application/json' }
