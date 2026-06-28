import { AppBar, Stack, Typography, type SxProps } from '@mui/material'
import { useAppSelector } from './app/hooks'
import { IconDirection } from './app/interface'
import { BackButton } from './features/selectedConcert/components/BackButton'

const appBarStyles: SxProps = {
  textAlign: 'left',
  position: 'static',
  width: '90%',
  margin: { xs: '30px auto 15px', sm: '30px auto 18px' },
  padding: '16px',
  paddingRight: '16px !important',
}

export function AppHeader(): JSX.Element {
  const {
    selectedConcert: { trackList, playlist },
  } = useAppSelector((state) => state.individualConcert)
  const hasTracklist = trackList?.length
  return (
    <AppBar sx={appBarStyles}>
      <Stack direction="row" style={{ justifyContent: 'space-between' }}>
        <Typography variant="h1">Concert Search</Typography>
        {hasTracklist || playlist?.length ? (
          <>
            <BackButton
              hasTracklist={hasTracklist}
              iconDirection={IconDirection.Right}
            />
          </>
        ) : null}
      </Stack>
    </AppBar>
  )
}
