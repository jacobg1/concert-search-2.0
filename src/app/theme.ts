import { createTheme } from '@mui/material/styles'
import { background } from './background'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7e89',
      // main: '#394376',
    },
    secondary: {
      main: '#8eb9ff',
    },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paperAnchorBottom: {
          display: 'flex',
          justifyContent: 'space-evenly',
        },
      },
    },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          // border: '2px solid white',
        },
        input: {
          fontSize: '1.1rem',
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
          width: '90%',
          margin: 'auto',
        },
        thumb: {
          borderRadius: 0,
          height: 16,
          width: 16,
        },
        rail: {
          height: 5,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          padding: '7px 0',
          margin: '15px 0',
          // border: '2px solid white',
          background,
        },
      },
    },
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
          fontSize: '1.2rem',
        },
        subtitle1: {
          fontWeight: 'bold',
        },
        body1: {
          fontSize: '1rem',
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
