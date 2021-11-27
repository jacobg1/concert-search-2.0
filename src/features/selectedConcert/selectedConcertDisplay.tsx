import { CircularProgress, Drawer, Stack } from '@mui/material'
import { SxProps } from '@mui/system'
import { useAppSelector } from '../../app/hooks'
import TrackListDisplay from '../tracks/TrackListDisplay'
const drawerStyles: SxProps = {
  height: '100%',
  flexShrink: 0,
  zIndex: 0,
  '& .MuiDrawer-paper': {
    height: '100%',
    boxSizing: 'border-box',
    zIndex: 0,
  },
  '& .MuiDrawer-paperAnchorBottom': {
    backgroundColor: '#2e7e89',
  },
}
interface SelectedConcertDisplayProps {
  isDrawerOpen: boolean
}
export default function SelectedConcertDisplay({
  isDrawerOpen,
}: SelectedConcertDisplayProps) {
  const {
    loading,
    selectedConcert: { trackList },
  } = useAppSelector((state) => state.individualConcert)
  // if (loading) return <CircularProgress />
  return (
    <Drawer
      sx={drawerStyles}
      variant="persistent"
      anchor="bottom"
      open={isDrawerOpen}
      hideBackdrop
    >
      <Stack my={10} alignItems="center">
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <TrackListDisplay trackList={trackList} />
        )}
      </Stack>
    </Drawer>
  )
}
