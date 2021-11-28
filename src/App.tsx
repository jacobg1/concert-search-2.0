import './App.css'
// import { fetchConcertList } from './features/concerts/concertListSlice'
// import { fetchSelectedConcert } from './features/selectedConcert/selectedConcertSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'
import ConcertListDisplay from './features/concerts/ConcertListDisplay'
import { Typography, AppBar, Box, GlobalStyles } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import BandAndYearSelect from './features/concertSelect/BandAndYearSelect'
import { background } from './app/background'
import { SxProps } from '@mui/system'
import SelectedConcertDisplay from './features/selectedConcert/SelectedConcertDisplay'
// import { useState } from 'react'
import { toggleConcertDrawer } from './features/selectedConcert/selectedConcertSlice'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7e89',
      // main: '#394376',
    },
    secondary: {
      main: '#8eb9ff',
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          borderRadius: 'none',
          backgroundColor: '#2e7e89',
          color: 'white',
        },
        noOptions: {
          borderRadius: 'none',
          backgroundColor: '#2e7e89',
          color: 'white',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          background: '#bed5ff',
          width: '90%',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          padding: '3px 0',
          margin: '15px 0',
          background,
        },
      },
    },
    // MuiAccordionDetails: {
    //   styleOverrides: {
    //     root: {
    //       width: 'auto',
    //       display: 'block',
    //     },
    //   },
    // },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textAlign: 'left',
        },
        h1: {
          fontSize: '1.8rem',
        },
        h2: {
          fontWeight: '600',
          fontSize: '1.1rem',
        },
        subtitle1: {
          fontWeight: 'bold',
        },
        body1: {
          fontSize: '.87rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#8eb9ff',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
})

const appBarStyles: SxProps = {
  textAlign: 'left',
  position: 'absolute',
  right: 0,
  left: 0,
  width: '90%',
  margin: '25px auto',
  padding: '16px',
  zIndex: 1,
  border: '2px solid #bed5ff',
}

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  // // dispatch(fetchConcertList({ bandName: 'moe.', year: '2011' }))
  // dispatch(fetchSelectedConcert('moe2011-03-25.salvo'))
  const { isDrawerOpen } = useAppSelector((state) => state.individualConcert)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{ body: { overflow: isDrawerOpen ? 'hidden' : 'auto' } }}
      />
      <Box>
        <AppBar
          sx={{
            ...appBarStyles,
            ...(isDrawerOpen && { position: 'fixed', borderColor: 'white' }),
          }}
        >
          <Typography
            variant="h1"
            onClick={() => dispatch(toggleConcertDrawer())}
          >
            Concert Crawler
          </Typography>
        </AppBar>
        <BandAndYearSelect />
        <ConcertListDisplay />
        <SelectedConcertDisplay isDrawerOpen={isDrawerOpen} />
      </Box>
    </ThemeProvider>
  )
}

export default App
