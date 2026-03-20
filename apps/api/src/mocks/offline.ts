import { createMockContext } from '@repo/mock-data/event'
import { json } from 'body-parser'
import express, { type Request, type Response } from 'express'
import { handler } from '../main'
import { cb, jsonContent, offlineConfig } from './config'
import {
  allowCrossDomain,
  createOfflineEvent,
  findConfigUrl,
  getPathParams,
} from './utils'

const offline = express()

offline.use(allowCrossDomain())
offline.use(json())

offline.options('/{*route}', (_: Request, res: Response) => res.end())

offline.all('/{*route}', async (req: Request, res: Response) => {
  try {
    const {
      method,
      body,
      query,
      params: { route }
    } = req

    if (typeof route === 'string') {
      throw new Error('Invalid Route')
    }

    const configUrl = findConfigUrl(offlineConfig, route, method)

    if (!configUrl) {
      throw Error('Invalid Route')
    }

    const params = getPathParams(configUrl.configPath, route)

    const response = await handler(
      createOfflineEvent(
        configUrl,
        { params, query, body }
      ),
      createMockContext(),
      cb
    )

    if (!response) {
      res.send()
      return
    }

    if (typeof response === 'string') {
      res.send(response)
      return
    }

    if ('body' in response && typeof response.body === 'string') {
      res.writeHead(200, jsonContent).end(response.body)
      return
    }

    res.send()
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Internal Server Error' })
  }
})

export { offline }
