import { createMockContext } from '@repo/mock-data/event'
import { json } from 'body-parser'
import express, { type Request, type Response } from 'express'
import type { OfflineConfig } from '../interface'
import { handler } from '../main'
import { createOfflineEvent, findConfigUrl } from './utils'

const offline = express()

offline.use(json())

const cb = () => null
const jsonContent = { 'Content-Type': 'application/json' }

const config: OfflineConfig[] = [
  {
    route: '/concerts/:id',
    method: 'GET',
    lambdaRoute: '/concerts/{id}'
  },
  {
    route: '/concerts',
    method: 'POST',
    lambdaRoute: '/concerts'
  },
]


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

    const configUrl = findConfigUrl(config, route, method)

    if (!configUrl) {
      throw Error('Invalid Route')
    }

    const response = await handler(
      createOfflineEvent(configUrl, { query, body }),
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
