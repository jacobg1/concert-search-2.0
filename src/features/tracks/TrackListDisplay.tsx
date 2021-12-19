import { List } from '@mui/material'
import { SxProps } from '@mui/system'
import SingleTrack from './components/SingleTrack'
import { TrackListData } from './trackInterface'

const listContainerStyles: SxProps = {
  width: '90%',
  margin: '5px auto',
  maxHeight: 'calc(75vh - 150px)',
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
  currentTrackName: string
  playNewTrack: (name: string) => void
}

export default function TrackListDisplay({
  trackList,
  playNewTrack,
  currentTrackName,
}: TrackListDisplayProps): JSX.Element | null {
  return (
    <List disablePadding sx={listContainerStyles}>
      {/* <Typography variant="body1">Tracks: {trackList.length}</Typography> */}
      {trackList.map((track) => {
        return (
          <SingleTrack
            {...track}
            key={track.name}
            playNewTrack={playNewTrack}
            currentTrackName={currentTrackName}
          />
        )
      })}
    </List>
  )
}
