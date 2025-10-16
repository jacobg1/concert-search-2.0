import { Logger, NotFoundException } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from 'aws-lambda'
import { ConcertService } from './services'
import { extractReqData, handleResponse, handleError } from './helpers'
import { HttpRoutes, type RouteConfigObj } from './interface'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'log', 'warn'],
  })

  return app
}

const routeConfig: RouteConfigObj<keyof ConcertService | undefined> = {
  [HttpRoutes.LIST_CONCERTS]: 'getConcertList',
  [HttpRoutes.GET_CONCERT_BY_ID]: 'getSingleConcert',
}

export const handler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async (event) => {
  try {
    const { routeKey } = event

    if (!routeKey) {
      throw new NotFoundException('Invalid request')
    }

    const routeHandler = routeConfig[routeKey]

    if (!routeHandler) {
      throw new NotFoundException('Not found')
    }

    const appContext = await bootstrap()
    const appService = appContext.get(ConcertService)

    const requestData = extractReqData(event)
    const response = await appService[routeHandler](requestData)

    return handleResponse(response)
  } catch (error) {
    Logger.error(error)
    return handleError(error)
  }
}
