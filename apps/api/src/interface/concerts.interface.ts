export interface SingleConcert {
  description: string
  identifier: string
  mediatype: string
  title: string
  year: number
  date: string
  coverage: string
  creator: string
  downloads: number
  format: MediaFormat[]
  source: string
}

export type PaginatedConcertList = SingleConcert[][]

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

enum MediaType {
  ETREE = 'etree',
}

export const { ETREE } = MediaType

export enum MediaFormat {
  MP3 = 'VBR MP3',
  OGG = 'Ogg Vorbis',
  FLAC = 'Flac',
}

export type SortBy = Record<string, SortOrder>

/**
 * Passed from front-end
 * @param mediaFormat user requested media formats
 * @param searchTerm  EX: 'Grateful+Dead+AND+year%3A1977'
 */
export interface ConcertSearchOptions {
  searchTerm: string
  max: number
  sortBy: SortBy
  filterDuplicates: boolean
  mediaFormat: MediaFormat[]
}

/**
 * Base options not set by user
 */
export interface BaseSearchOptions {
  searchBy: string
  fields: string[]
}

/**
 * Options passed to archive.org
 */
export interface ArchiveSearchOptions extends BaseSearchOptions {
  max: number
  sortBy: SortBy
}

/**
 * Response from archive's api
 */
export interface SearchResponse {
  numFound: number
  start: number
  docs: SingleConcert[]
}

interface TrackMetaData {
  title: string
  creator: string
  description: string
  date: string
  venue: string
  source: string
}

export interface TrackListData {
  format: MediaFormat
  name: string
  source: string
  original: string
  length: string
  link: string
  title: string
}

export interface ConcertData {
  trackList: TrackListData[]
  metadata: TrackMetaData
}

export interface ConcertResponse extends Omit<ConcertData, 'trackList'> {
  files: TrackListData[]
}

export type ReqObj = Record<string, unknown> | Record<string, unknown[]>

export type FilterParams = Pick<
  ConcertSearchOptions,
  'filterDuplicates' | 'mediaFormat'
>

export type DateLookupObj = Record<string, boolean>

export type RouteConfigObj<T> = Record<string, T>

export interface ConcertListInput {
  body?: ConcertSearchOptions
}

export interface GetConcertInput {
  pathParameters?: { id?: string }
}

export interface ErrorInfo {
  message: string
  statusCode: number
}

export type MediaFormatKey = keyof typeof MediaFormat

export type UnvalidatedInput = Partial<ConcertSearchOptions>
