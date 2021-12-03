import './App.css'
// import { fetchConcertList } from './features/concerts/concertListSlice'
// import { fetchSelectedConcert } from './features/selectedConcert/selectedConcertSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'
import ConcertListDisplay from './features/concerts/ConcertListDisplay'
import { Typography, AppBar, Box, GlobalStyles, Stack } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import BandAndYearSelect from './features/concertSelect/BandAndYearSelect'
import { background } from './app/background'
import { SxProps } from '@mui/system'
import SelectedConcertDisplay from './features/selectedConcert/SelectedConcertDisplay'
// import { useState } from 'react'
// import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
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
    MuiSelect: {
      styleOverrides: {
        select: {
          background,
          borderRadius: 0,
          textAlign: 'left',
          fontWeight: 'bold',
        },
      },
    },
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
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            background: '#2e7e89',
            borderColor: '#ffffff',
            '& span, p': {
              color: '#ffffff',
              textShadow: '0.5px 0.5px 3px #3a1b1c',
            },
          },
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
    MuiSlider: {
      styleOverrides: {
        root: {
          borderRadius: 0,
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
}

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  // // dispatch(fetchConcertList({ bandName: 'moe.', year: '2011' }))
  // dispatch(fetchSelectedConcert('moe2011-03-25.salvo'))
  const {
    isDrawerOpen,
    selectedConcert: { trackList },
  } = useAppSelector((state) => state.individualConcert)

  const handleConcertDrawer = (): void | null => {
    if (trackList.length) {
      dispatch(toggleConcertDrawer())
    } else {
      return null
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{ body: { overflow: isDrawerOpen ? 'hidden' : 'auto' } }}
      />
      <Box>
        <AppBar
          onClick={handleConcertDrawer}
          sx={{
            ...appBarStyles,
            ...(isDrawerOpen && {
              position: 'fixed',
              border: '2px solid white',
            }),
          }}
        >
          <Stack
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h1">Concert Search</Typography>
            {trackList.length ? (
              <>
                <Typography alignSelf="center" variant="body1">
                  Back
                </Typography>
              </>
            ) : null}
          </Stack>
        </AppBar>
        <BandAndYearSelect />
        <ConcertListDisplay />
        <SelectedConcertDisplay />
      </Box>
    </ThemeProvider>
  )
}

export default App
