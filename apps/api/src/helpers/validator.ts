import { Logger, BadRequestException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { ConcertListDto } from '../dto'
import {
  MediaFormat,
  type MediaFormatKey,
  type ConcertSearchOptions,
  type UnvalidatedInput,
} from '../interface'
import { createErrorString } from './errors'

export class ConcertValidator {
  formatValue(value: string[]): MediaFormat[] {
    return value.map(
      (val) => MediaFormat[val.toLocaleUpperCase() as MediaFormatKey]
    )
  }
  async transform(value: UnvalidatedInput) {
    const { mediaFormat, ...rest } = value

    const formatObj = {
      ...(mediaFormat && { mediaFormat: this.formatValue(mediaFormat) }),
      ...rest,
    }

    const instance = plainToInstance(ConcertListDto, formatObj)

    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    })

    if (errors.length > 0) {
      Logger.error(errors)
      const errorString = createErrorString(errors)
      throw new BadRequestException(errorString)
    }

    return formatObj as ConcertSearchOptions
  }
}
