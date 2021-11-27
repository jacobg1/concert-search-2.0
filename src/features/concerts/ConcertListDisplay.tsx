import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import ConcertAccordion from './components/ConcertAccordion'
import ConcertPagination from './components/ConcertPagination'
import { PaginationHandler, AccordionHandler } from './concertListInterface'

export default function ConcertListDisplay(): JSX.Element | null {
  const { concerts, loading } = useAppSelector((state) => state.concertList)
  // TODO: reset page number when new search is made
  const [pageNumber, setPageNumber] = useState(1)
  const [expanded, setExpanded] = useState<string | false>(false)

  const handlePageChange: PaginationHandler = (event, value) => {
    setExpanded(false)
    setPageNumber(value)
  }

  const handleAccordionChange: AccordionHandler =
    (id) => (event, isExpanded) => {
      setExpanded(isExpanded ? id : false)
    }

  if (loading) return <CircularProgress />
  // TODO: add record player animation
  if (!concerts.length) return null

  return (
    <div style={{ width: '90%', margin: '25px auto 0' }}>
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
        count={concerts.length - 1}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}

// TODO: playlist as mui drawer
