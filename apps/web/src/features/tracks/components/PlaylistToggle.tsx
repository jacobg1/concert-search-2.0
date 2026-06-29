import AddBoxIcon from '@mui/icons-material/AddBox'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import type { PlaylistToggleProps } from '../trackInterface'
import type { SxProps } from '@mui/material'

const toggleIconStyles: SxProps = {
  fontSize: { xs: '1.7rem', md: '1.5rem' },
}

export function PlaylistToggle({
  add,
  track,
  setPlaylist,
}: PlaylistToggleProps) {
  if (add) {
    return (
      <AddBoxIcon
        sx={toggleIconStyles}
        onClick={(e) => {
          e.stopPropagation()
          setPlaylist((prevList) => [...prevList, track])
        }}
      />
    )
  }

  return (
    <IndeterminateCheckBoxIcon
      sx={toggleIconStyles}
      onClick={(e) => {
        e.stopPropagation()
        setPlaylist((prevList) => {
          return prevList.filter((song) => song?.md5 !== track.md5)
        })
      }}
    />
  )
}
