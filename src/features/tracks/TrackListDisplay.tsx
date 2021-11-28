import { List } from '@mui/material'
import { SxProps } from '@mui/system'
import SingleTrack from './components/SingleTrack'
import { TrackListData } from './trackInterface'

const listContainerStyles: SxProps = {
  width: '90%',
  margin: '5px auto',
  maxHeight: '60vh',
  overflowY: 'auto',
  '& .MuiButtonBase-root': {
    '&:first-of-type': {
      marginTop: 0,
    },
    '&:last-of-type': {
      marginBottom: 0,
    },
  },
}

interface TrackListDisplayProps {
  trackList: TrackListData[]
}

// TODO: order by track# in back-end
export default function TrackListDisplay({
  trackList,
}: TrackListDisplayProps): JSX.Element | null {
  if (!trackList.length) return null
  return (
    <List disablePadding sx={listContainerStyles}>
      {trackList.map((track) => {
        return <SingleTrack key={track.name} {...track} />
      })}
    </List>
  )
}
