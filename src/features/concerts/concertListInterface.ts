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
