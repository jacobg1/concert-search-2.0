import { Theme } from '@mui/material'
import { GlobalStyles } from '@mui/system'
import { background } from './app/background'
import { useAppSelector } from './app/hooks'

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
            fontSize: '15.5px',
          },
          [theme.breakpoints.up('lg')]: {
            fontSize: '16px',
          },
          [theme.breakpoints.up('xl')]: {
            fontSize: '17px',
          },
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
          margin: 'auto',
          textAlign: 'center',
          backgroundColor: '#bed5ff',
        },
      }}
    />
  )
}
