import { createMockEvent } from '@repo/mock-data/event'
import type { OfflineConfig, OfflineParams } from '../interface'

function doesUrlMatch(configUrlArray: string[], urlArray: string[]): boolean {
  return configUrlArray.every((item, index) => {
    if (item[0] === ':') return true
    return urlArray[index] === item
  })
}

function formatUrl(url: string): string[] {
  return url.replace('/', '').split('/')
}

export function findConfigUrl(
  config: OfflineConfig[],
  urlArray: string[],
  reqMethod: string
): OfflineConfig | undefined {
  return config.find(({ route, method }) => {
    if (method !== reqMethod) return false

    const splitUrl = formatUrl(route)
    if (splitUrl.length !== urlArray.length) return false

    return doesUrlMatch(splitUrl, urlArray)
  })
}

export function createOfflineEvent(
  { method, route, lambdaRoute }: OfflineConfig,
  { body, query }: OfflineParams
) {
  return createMockEvent({
    method,
    route: lambdaRoute,
    path: route,
    pathParameters: { id: '234324' }, // TODO
    ...(body && { body }),
    ...(query && { queryStringParameters: query })
  })
}
