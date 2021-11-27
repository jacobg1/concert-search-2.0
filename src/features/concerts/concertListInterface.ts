import { ChangeEvent } from 'react'

export type PaginationHandler = (
  event: ChangeEvent<unknown>,
  value: number
) => void

export type AccordionHandler = (
  id: string
) => (event: React.SyntheticEvent, isExpanded: boolean) => void
