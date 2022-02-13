import { SerializedError } from '@reduxjs/toolkit'
import { ChangeEvent } from 'react'

export type AccordionHandler = (
  id: string
) => (event: React.SyntheticEvent, isExpanded: boolean) => void

export interface ConcertAccordionProps {
  identifier: string
  title: string
  description: string
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
}

export type ChunkedConcertList = SingleConcertMeta[][]

export interface SearchBody {
  searchTerm: string
  max: number
  sortBy: Record<string, string>
  filterDuplicates: boolean
}

export interface SearchParams {
  bandName: string
  year: string
  filterDuplicates: boolean
}

export interface ConcertListState {
  concerts: ChunkedConcertList
  concertQuery: SearchParams
  loading: boolean
  error: SerializedError
  pageNumber: number
}
