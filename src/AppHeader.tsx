import { AppBar, Stack, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { toggleConcertDrawer } from './features/selectedConcert/selectedConcertSlice'

const appBarStyles: SxProps = {
  textAlign: 'left',
  position: 'static',
  width: '90%',
  margin: { xs: '30px auto 15px', sm: '30px auto 18px' },
  padding: '16px',
}

export function AppHeader(): JSX.Element {
  const dispatch = useAppDispatch()
  const {
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
    <AppBar onClick={handleConcertDrawer} sx={appBarStyles}>
      <Stack display="flex" flexDirection="row" justifyContent="space-between">
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
  )
}
