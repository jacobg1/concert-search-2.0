import { Pagination, Box } from '@mui/material'
import { SxProps } from '@mui/system'
import { ConcertPaginationProps } from '../concertListInterface'

const paginationStyles: SxProps = {
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
  '& .MuiPagination-ul': {
    flexWrap: 'nowrap',
    width: '90%',
  },
}

const boxStyles = {
  display: 'flex',
  justifyContent: 'center',
  width: '90%',
  margin: '20px auto',
}

export default function ConcertPagination({
  count,
  pageNumber,
  handlePageChange,
}: ConcertPaginationProps): JSX.Element | null {
  // Only show pagination if more than one page
  if (count <= 1) return null
  return (
    <Box my={3} style={boxStyles}>
      <Pagination
        shape="rounded"
        color="primary"
        count={count}
        page={pageNumber}
        sx={paginationStyles}
        onChange={handlePageChange}
      />
    </Box>
  )
}
