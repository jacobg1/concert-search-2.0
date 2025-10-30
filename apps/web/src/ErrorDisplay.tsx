import { Box, Snackbar, Typography, type SxProps } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { clearConcertListError } from './features/concerts/concertListSlice'
import { clearSelectedConcertError } from './features/selectedConcert/selectedConcertSlice'
import { hasNetworkError } from './app/util'

const snackbarStyles = {
  left: '15px',
  right: '15px',
  bottom: '25px',
  color: '#ffffff',
}

const boxStyles: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '13px',
  width: { sm: '100%', md: '40%' },
  backgroundColor: '#d32f2f',
  '& .MuiTypography-body1': {
    paddingLeft: '15px',
  },
  '& .MuiSvgIcon-root': {
    alignSelf: 'center',
    display: 'inline-block',
  },
}

export function ErrorDisplay(): JSX.Element {
  const dispatch = useAppDispatch()

  const { error: listError } = useAppSelector((state) => state.concertList)
  const { error: concertError } = useAppSelector(
    (state) => state.individualConcert
  )

  return (
    <Snackbar
      style={snackbarStyles}
      open={hasNetworkError(listError, concertError)}
    >
      <Box sx={boxStyles}>
        <Box display="inline-flex">
          <ErrorOutlineSharpIcon fontSize="medium" />
          <Typography>
            Oops! Something went wrong, please update search and try again.
          </Typography>
        </Box>
        <IconButton
          size="medium"
          aria-label="close"
          color="inherit"
          data-testid="close-error-button"
          onClick={() => {
            dispatch(clearConcertListError())
            dispatch(clearSelectedConcertError())
          }}
        >
          <CloseIcon color="inherit" fontSize="medium" />
        </IconButton>
      </Box>
    </Snackbar>
  )
}
