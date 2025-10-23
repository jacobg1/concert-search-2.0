import { ValidationError } from '@nestjs/common'

export const testValidationErrors = [
  {
    value: '50',
    property: 'max',
    children: [],
    constraints: {
      isNumber: 'max must be a number conforming to the specified constraints',
    },
  },
  {
    value: {
      downloads: 'desdfc',
    },
    property: 'sortBy',
    children: [
      {
        value: 'desdfc',
        property: 'downloads',
        children: [],
        constraints: {
          isEnum: 'downloads must be one of the following values: asc, desc',
        },
      },
    ],
  },
  {
    value: ['Ogg Vorbis', null],
    property: 'mediaFormat',
    children: [],
    constraints: {
      isEnum:
        'each value in mediaFormat must be one of the following values: VBR MP3, Ogg Vorbis, Flac',
    },
  },
] as ValidationError[]

export const expectedErrorString =
  'max must be a number conforming to the specified constraints, downloads must be one of the following values: asc, desc, each value in mediaFormat must be one of the following values: VBR MP3, Ogg Vorbis, Flac.'
