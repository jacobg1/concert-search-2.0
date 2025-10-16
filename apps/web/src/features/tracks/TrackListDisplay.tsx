import { List, type SxProps } from '@mui/material'
import SingleTrack from './components/SingleTrack'
import { TrackListDisplayProps } from './trackInterface'
import { memo } from 'react'

const listContainerStyles: SxProps = {
  width: '90%',
  margin: '5px auto',
  maxHeight: 'calc(60vh - 150px)',
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

function TrackListDisplay({
  trackList,
  playNewTrack,
  currentTrackName,
}: TrackListDisplayProps): JSX.Element | null {
  return (
    <List disablePadding sx={listContainerStyles}>
      {trackList.map((track) => {
        return (
          <SingleTrack
            key={track.name}
            playNewTrack={playNewTrack}
            currentTrackName={currentTrackName}
            {...track}
          />
        )
      })}
    </List>
  )
}

export default memo(TrackListDisplay)
