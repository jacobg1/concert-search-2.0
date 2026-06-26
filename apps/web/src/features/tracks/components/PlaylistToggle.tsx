import AddBoxIcon from '@mui/icons-material/AddBox'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import type { PlaylistToggleProps } from '../trackInterface'

export function PlaylistToggle({
  add,
  track,
  setPlaylist,
}: PlaylistToggleProps) {
  if (add) {
    return (
      <AddBoxIcon
        onClick={(e) => {
          e.stopPropagation()
          setPlaylist((prevList) => [...prevList, track])
        }}
      />
    )
  }

  return (
    <IndeterminateCheckBoxIcon
      onClick={(e) => {
        e.stopPropagation()
        setPlaylist((prevList) => {
          return prevList.filter((song) => song?.md5 !== track.md5)
        })
      }}
    />
  )
}
