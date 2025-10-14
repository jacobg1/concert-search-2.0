import { handler as mainHandler } from '../main'
import type {
  APIGatewayProxyEventV2,
  Callback,
  Context,
  Handler,
} from 'aws-lambda'
import { server } from './node'

server.events.on('request:start', ({ request: { method, url } }) => {
  console.log('MSW intercepted:', method, url)
})

export const handler: Handler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<any>
) => {
  server.listen()
  return mainHandler(event, context, callback)
}
