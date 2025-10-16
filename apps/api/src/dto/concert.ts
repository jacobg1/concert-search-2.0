import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { MediaFormat, SortOrder, type SortBy } from '../interface'

class SortByDto {
  @IsOptional()
  @IsEnum(SortOrder)
  date: SortOrder

  @IsOptional()
  @IsEnum(SortOrder)
  downloads: SortOrder
}

export class ConcertListDto {
  @IsString()
  searchTerm: string

  @IsNumber({ allowNaN: false, allowInfinity: false })
  max: number

  @IsBoolean()
  filterDuplicates: boolean

  @IsObject()
  @ValidateNested()
  @Type(() => SortByDto)
  sortBy: SortBy

  @ArrayNotEmpty()
  @IsEnum(MediaFormat, { each: true })
  mediaFormat: MediaFormat[]
}
