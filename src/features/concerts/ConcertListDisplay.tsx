import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import ConcertAccordion from './components/ConcertAccordion'
import ConcertPagination from './components/ConcertPagination'
import { PaginationHandler, AccordionHandler } from './concertListInterface'
import { setPageNumber } from './concertListSlice'
import { RecordIcon } from './components/RecordIcon'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export default function ConcertListDisplay(): JSX.Element {
  const dispatch = useAppDispatch()
  const { concerts, loading, pageNumber } = useAppSelector(
    (state) => state.concertList
  )
  const [expanded, setExpanded] = useState<string | false>(false)

  const handlePageChange: PaginationHandler = (_e, value) => {
    setExpanded(false)
    dispatch(setPageNumber(value))
  }

  const handleAccordionChange: AccordionHandler = (id) => (_e, isExpanded) => {
    setExpanded(isExpanded ? id : false)
  }

  if (!concerts.length && !loading) return <RecordIcon />

  if (loading) return <CircularProgress />

  return (
    <div style={{ width: '90%', margin: '40px auto 0' }}>
      {concerts[pageNumber - 1].map((concert, i) => {
        return (
          <ConcertAccordion
            key={`concert-${i}`}
            expanded={expanded}
            handleChange={handleAccordionChange}
            {...concert}
          />
        )
      })}
      <ConcertPagination
        pageNumber={pageNumber}
        count={concerts.length}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
