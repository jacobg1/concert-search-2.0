import { ChangeEvent } from 'react'
import { MediaFormat, NetworkError, SortOrder } from '../../app/interface'

export type AccordionHandler = (
  id: string
) => (event: React.SyntheticEvent, isExpanded: boolean) => void

export interface ConcertAccordionProps extends SingleConcertMeta {
  expanded: string | false
  handleChange: AccordionHandler
}

export type PaginationHandler = (
  event: ChangeEvent<unknown>,
  value: number
) => void

export interface ConcertPaginationProps {
  count: number
  pageNumber: number
  handlePageChange: PaginationHandler
}

export interface SingleConcertMeta {
  description: string
  identifier: string
  mediatype: string
  title: string
  year: number
  source: string
}

export type ChunkedConcertList = SingleConcertMeta[][]

interface SortBy {
  downloads: SortOrder
}

/**
 * Passed from component
 */
export interface SearchParams {
  bandName: string
  year: string
  filterDuplicates: boolean
  sortBy: SortBy
}

/**
 * Passed to back-end
 */
export interface SearchBody extends Omit<SearchParams, 'bandName' | 'year'> {
  searchTerm: string
  max: number
  mediaFormat: MediaFormat[]
}

export interface ConcertListState {
  concerts: ChunkedConcertList
  concertQuery: SearchParams
  loading: boolean
  error: NetworkError | Record<string, never>
  pageNumber: number
}
