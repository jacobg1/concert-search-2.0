import { HttpStatus } from '@nestjs/common'
import { createMockContext } from '@repo/mock-data/event'
import { json } from 'body-parser'
import express, { type Request, type Response } from 'express'
import type { OfflineRequest } from '../interface'
import { handler } from '../main'
import { cb, jsonContent, offlineConfig } from './config'
import {
  allowCrossDomain,
  createOfflineEvent,
  findConfigUrl,
  getPathParams,
  handleMockAudio,
} from './utils'
import path from 'path'

const offline = express()

offline.use(allowCrossDomain())
offline.use(handleMockAudio())
offline.use(json())
offline.use(
  '/sound',
  express.static(path.join(__dirname, '../dist/sound'))
)

offline.options('/{*route}', (_: Request, res: Response) => res.end())

offline.all('/{*route}', async (req: OfflineRequest, res: Response) => {
  try {
    const {
      url,
      method,
      body,
      query,
      params: { route },
    } = req

    const configUrl = findConfigUrl(offlineConfig, route, method)

    if (!configUrl) {
      throw Error('Route Not Found')
    }

    const params = getPathParams(configUrl.configPath, url)

    const response = await handler(
      createOfflineEvent(configUrl, { params, query, body }),
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
      res.writeHead(HttpStatus.OK, jsonContent).end(response.body)
      return
    }

    throw new Error('Invalid Api Response')
  } catch (err: unknown) {
    console.log(err)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
    })
  }
})

export { offline }
