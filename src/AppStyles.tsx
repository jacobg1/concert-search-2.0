import { Theme } from '@mui/material'
import { GlobalStyles } from '@mui/system'
import { useAppSelector } from './app/hooks'
import { background } from './app/background'

export function AppStyles({ theme }: { theme: Theme }): JSX.Element {
  const { isDrawerOpen } = useAppSelector((state) => state.individualConcert)
  return (
    <GlobalStyles
      styles={{
        html: {
          fontSize: '12px',

          [theme.breakpoints.up('sm')]: {
            fontSize: '13px',
          },
          [theme.breakpoints.up('md')]: {
            fontSize: '14px',
          },
          // [theme.breakpoints.up('lg')]: {
          //   fontSize: '14.5px',
          // },
          '*::-webkit-scrollbar': {
            width: '10px',
            WebkitAppearance: 'none',
            WebkitOverflowScrolling: 'auto',
          },
          '*::-webkit-scrollbar-track': {
            background,
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#2e7e89',
            border: '1px solid white',
          },
        },
        body: {
          overflow: isDrawerOpen ? 'hidden' : 'auto',
          maxWidth: '1000px',
          margin: 'auto',
          textAlign: 'center',
          backgroundColor: '#bed5ff',
        },
      }}
    />
  )
}
