import { Pagination, Box } from '@mui/material'
import { ConcertPaginationProps } from '../concertListInterface'

export default function ConcertPagination({
  count,
  pageNumber,
  handlePageChange,
}: ConcertPaginationProps): JSX.Element | null {
  // Only show pagination if more than one page
  if (count <= 1) return null
  return (
    <Box my={3} display="flex" justifyContent="center">
      <Pagination
        count={count}
        page={pageNumber}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: 0,
          },
        }}
      />
    </Box>
  )
}
