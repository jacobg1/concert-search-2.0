import { createMockEvent } from '@repo/mock-data/event';
import type { OfflineConfig, OfflineParams } from '../interface';

const checkFirstLetter = (
  str: string | string[],
  comp: string
): boolean => str[0] === comp;

function doesUrlMatch(configUrlArray: string[], urlArray: string[]): boolean {
  return configUrlArray.every((item, index) => {
    if (checkFirstLetter(item, ":")) return true
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
  { body, query, params }: OfflineParams
) {
  return createMockEvent({
    method,
    route: lambdaRoute,
    path: route,
    pathParameters: params,
    ...(body && { body }),
    ...(query && { queryStringParameters: query })
  })
}

export function getPathParams(
  offlineRoute: string,
  route: string[]
): Record<string, string> {
  return formatUrl(offlineRoute).reduce((acc, curr, i) => {
    if (checkFirstLetter(curr, ":")) {
      return {
        ...acc,
        [curr.replace(":", "")]: route[i]
      }
    }
    return acc
  }, {})
}
