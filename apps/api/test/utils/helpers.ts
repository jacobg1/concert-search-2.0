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
import type {
  TestError,
  ExpectedResponse,
  ExpectedException,
  TestLambdaResponse,
} from '../types'

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

export const expectedHeaders = {
  'Content-Type': 'application/json',
}

export const expectedErrorHeaders = {
  ...expectedHeaders,
  'x-amzn-ErrorType': 'Error',
}

function getTestBody(body?: string) {
  if (typeof body === 'string') {
    return JSON.parse(body) as Record<string, unknown>
  }
  return body
}

export function testLambdaResponse(
  { statusCode, headers, body }: TestLambdaResponse,
  { expectedBody, expectedHeaders, expectedStatusCode }: ExpectedResponse
) {
  expect(statusCode).toBe(expectedStatusCode)
  expect(headers).toEqual(expectedHeaders)
  isDefinedAs('string', body)

  if (expectedBody) {
    expect(getTestBody(body)).toEqual(expectedBody)
  }
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

export function testErrorInfo(
  { message, statusCode }: TestError,
  { msg, status }: ExpectedException
) {
  expect(statusCode).toBe(status)
  expect(message).toBe(msg)
}

export function testException(
  err: unknown,
  exception: unknown,
  { msg, status }: ExpectedException
) {
  expect(err).toBeDefined()
  expect(err).toBeInstanceOf(exception)

  const errorInfo = getTestExceptionInfo(err)

  testErrorInfo(errorInfo, { msg, status })
}

export function filterDuplicates2d<T extends object>(
  arrayOfArrays: T[][],
  key: keyof T,
  value: unknown
) {
  return arrayOfArrays.reduce(
    (acc, curr) => [...acc, ...curr.filter((item) => item[key] === value)],
    []
  )
}

export function getFromEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    throw new Error(`Missing env var: ${key}`)
  }
  return val
}

export function getMockPath(key: string): string {
  const val = getFromEnv(key)
  return `GET ${val}`
}

export async function getJsonResponse<T extends object>(response?: Response) {
  const json = await response?.text()
  if (!json) {
    throw new Error('Failed to get json response')
  }
  return JSON.parse(json) as T
}
