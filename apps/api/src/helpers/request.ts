import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import type { ReqObj } from '../interface'
import { BadRequestException } from '@nestjs/common'

const parseReqBody = (body: string) => {
  try {
    return JSON.parse(body) as ReqObj
  } catch {
    throw new BadRequestException('Invalid request body')
  }
}

export const extractReqData = (event: APIGatewayProxyEventV2): ReqObj => {
  const { body, queryStringParameters, pathParameters } = event

  return {
    ...(body && { body: parseReqBody(body) }),
    ...(queryStringParameters && { queryStringParameters }),
    ...(pathParameters && { pathParameters }),
  }
}
