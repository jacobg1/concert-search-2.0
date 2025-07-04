import { Box, Snackbar, Typography, type SxProps } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp'
import { useEffect, useState } from 'react'
import { useAppSelector } from './app/hooks'

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
  const { error: listError } = useAppSelector((state) => state.concertList)
  const { error: concertError } = useAppSelector(
    (state) => state.individualConcert
  )
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const hasError =
      (listError && Object.keys(listError).length !== 0) ||
      (concertError && Object.keys(concertError).length !== 0)
    setOpen(hasError)
  }, [listError, concertError])

  return (
    <Snackbar style={snackbarStyles} open={open}>
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
          onClick={() => setOpen(false)}
        >
          <CloseIcon color="inherit" fontSize="medium" />
        </IconButton>
      </Box>
    </Snackbar>
  )
}
