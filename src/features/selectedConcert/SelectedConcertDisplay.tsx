import { CircularProgress, Drawer, Stack } from '@mui/material'
import { SxProps } from '@mui/system'
import { useAppSelector } from '../../app/hooks'
import TrackListDisplay from '../tracks/TrackListDisplay'
import ConcertMeta from '../tracks/components/ConcertMeta'

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
    overflow: 'hidden',
  },
}

interface SelectedConcertDisplayProps {
  isDrawerOpen: boolean
}

export default function SelectedConcertDisplay({
  isDrawerOpen,
}: SelectedConcertDisplayProps): JSX.Element {
  const {
    loading,
    selectedConcert: { trackList, metaData },
  } = useAppSelector((state) => state.individualConcert)

  return (
    <Drawer
      sx={drawerStyles}
      variant="persistent"
      anchor="bottom"
      open={isDrawerOpen}
      hideBackdrop
    >
      <Stack my={15} alignItems="center">
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <>
            {metaData && (
              <ConcertMeta
                date={metaData.date}
                title={metaData.title}
                description={metaData.description}
                creator={metaData.creator}
                venue={metaData.venue}
                source={metaData.source}
              />
            )}
            <TrackListDisplay trackList={trackList} />
          </>
        )}
      </Stack>
    </Drawer>
  )
}
