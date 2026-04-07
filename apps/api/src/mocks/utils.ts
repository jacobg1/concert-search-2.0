import { createMockEvent } from '@repo/mock-data/event'
import type {
  Request as ExpressRequest,
  NextFunction,
  Response,
} from 'express'
import { match } from 'path-to-regexp'
import type {
  OfflineConfig,
  OfflineParams,
  PathParams,
} from '../interface'
import path from 'path'

const checkFirstLetter = (str: string | string[], comp: string): boolean =>
  str[0] === comp

function doesUrlMatch(
  configUrlArray: string[],
  urlArray: string[]
): boolean {
  return configUrlArray.every((item, index) => {
    if (checkFirstLetter(item, ':')) return true
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
  return config.find(({ configPath, method }) => {
    if (method !== reqMethod) return false

    const splitUrl = formatUrl(configPath)
    if (splitUrl.length !== urlArray.length) return false

    return doesUrlMatch(splitUrl, urlArray)
  })
}

export function createOfflineEvent(
  { method, configPath, lambdaRoute }: OfflineConfig,
  { body, query, params }: OfflineParams
) {
  return createMockEvent({
    method,
    route: lambdaRoute,
    path: configPath,
    pathParameters: params,
    ...(body && { body }),
    ...(query && { queryStringParameters: query }),
  })
}

export function getPathParams(route: string, url: string): PathParams {
  const result = match<PathParams>(route)(url)
  if (!result) return {}

  return result.params
}

export const logMockRequest = ({
  request: { method, url },
}: {
  request: Request
}) => {
  console.log('MSW intercepted:', method, url)
}

export function allowCrossDomain() {
  return (_: ExpressRequest, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Cross-Origin-Resource-Policy', 'cross-origin')

    next()
  }
}

export function handleMockAudio() {
  const mockAudioPath = '/mock-audio'
  const soundPath = '/sound'

  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.path.includes(soundPath)) {
      const ext = req.path.includes('.ogg') ? '.ogg' : '.mp3'

      res.sendFile(
        path.join(__dirname, `${soundPath}${mockAudioPath}${ext}`)
      )
      return
    }

    next()
  }
}
