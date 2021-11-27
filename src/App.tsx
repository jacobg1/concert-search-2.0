import React from 'react'
import './App.css'
import { fetchConcertList } from './features/concerts/concertListSlice'
import { fetchIndividualConcert } from './features/concerts/individualConcertSlice'
import { useAppDispatch } from './app/hooks'
import ConcertListDisplay from './features/concerts/ConcertListDisplay'
import { Typography, AppBar } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import BandAndYearSelect from './features/concertSelect/BandAndYearSelect'
import { background } from './app/background'

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

function App() {
  const dispatch = useAppDispatch()
  dispatch(fetchConcertList({ bandName: 'moe.', year: '2011' }))
  // dispatch(fetchIndividualConcert('moe2011-03-25.salvo'))

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar
          sx={{
            textAlign: 'left',
            position: 'static',
            width: '90%',
            margin: '25px auto',
            padding: '16px',
          }}
        >
          <Typography variant="h1">Concert Crawler</Typography>
        </AppBar>
        <BandAndYearSelect />
        <ConcertListDisplay />
      </div>
    </ThemeProvider>
  )
}

export default App
