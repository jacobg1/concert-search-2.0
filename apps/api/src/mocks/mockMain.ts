import { handler as mainHandler } from '../main'
import type {
  APIGatewayProxyEventV2,
  Callback,
  Context,
  Handler,
} from 'aws-lambda'
import { server } from './node'
import { logMockRequest } from '../../src/helpers'

server.events.on('request:start', logMockRequest)

export const handler: Handler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
) => {
  server.listen()
  return mainHandler(event, context, callback)
}
