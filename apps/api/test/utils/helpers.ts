import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import {
  MediaFormat,
  SortOrder,
  type SingleConcert,
  type ConcertData,
  type PaginatedConcertList,
  type ConcertSearchOptions,
  type TrackMetaData,
} from '../../src/interface'
import { HttpException } from '@nestjs/common'

export function isDefinedAs(typeName: string, val?: unknown): void {
  expect(val).toBeDefined()
  expect(typeof val).toBe(typeName)
}

export function getApiBaseUrl(): string {
  const url = process.env.API_BASE_URL
  if (!url) {
    throw new Error('Missing api base url')
  }
  return url
}

export function getMockInput(searchTerm: string): ConcertSearchOptions {
  return {
    searchTerm,
    max: 50,
    filterDuplicates: false,
    sortBy: { downloads: SortOrder.DESC },
    mediaFormat: ['mp3' as MediaFormat, 'ogg' as MediaFormat],
  }
}

export function testSingleConcert({ trackList, metadata }: ConcertData): void {
  expect(trackList.length).toBeGreaterThan(0)

  trackList.forEach(({ title, link, length }) => {
    expect(title).toBeDefined()
    expect(link).toBeDefined()
    expect(length).toBeDefined()
    // TODO - more comprehensive test for link
    expect(link).toContain('https://')
  })

  const metadataFields = ['creator', 'date', 'description', 'venue', 'source']

  for (const field of metadataFields) {
    expect(metadata[field as keyof TrackMetaData]).toBeDefined()
  }
}

const concertListFields = [
  'identifier',
  'date',
  'description',
  'mediatype',
  'source',
  'title',
]

export function testConcertList(list: PaginatedConcertList): void {
  expect(list.length).toBeGreaterThan(0)

  list.forEach((page) => {
    expect(page.length).toBeGreaterThan(0)

    page.forEach((concert) => {
      concertListFields.forEach((field) => {
        isDefinedAs('string', concert[field as keyof SingleConcert])
      })

      const { mediatype, format } = concert

      expect(mediatype).toBe('etree')
      expect(format).toContain(MediaFormat.MP3)
      expect(format).toContain(MediaFormat.OGG)
    })
  })
}

const expectedHeaders = {
  'Content-Type': 'application/json',
}

export function testLambdaResponse(
  response: APIGatewayProxyStructuredResultV2
) {
  expect(response).toBeDefined()
  expect(response.statusCode).toBe(200)
  expect(response.headers).toEqual(expectedHeaders)
  isDefinedAs('string', response.body)
}

interface TestError {
  message?: string
  statusCode: number
}

function getTestExceptionInfo(error: unknown): TestError {
  if (error instanceof HttpException) {
    const statusCode = error.getStatus()
    const response = error.getResponse()

    return {
      statusCode,
      message: (response as TestError).message ?? '',
    }
  }

  throw new Error('Invalid exception')
}

interface ExpectedException {
  msg: string
  status: number
}

export function testException(
  err: unknown,
  exception: unknown,
  { msg, status }: ExpectedException
) {
  expect(err).toBeDefined()
  expect(err).toBeInstanceOf(exception)

  const { message, statusCode } = getTestExceptionInfo(err)

  expect(statusCode).toBe(status)
  expect(message).toBe(msg)
}
