import { NestFactory } from '@nestjs/core'
import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

type GenericModule =
  | Type
  | DynamicModule
  | ForwardReference
  | Promise<GenericModule>

export function bootstrap(module: GenericModule) {
  return NestFactory.createApplicationContext(module, {
    logger: ['error', 'log', 'warn'],
  })
}
