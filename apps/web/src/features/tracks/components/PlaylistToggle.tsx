import AddBoxIcon from '@mui/icons-material/AddBox'
import RemoveIcon from '@mui/icons-material/Remove'
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
    <RemoveIcon
      onClick={(e) => {
        e.stopPropagation()
        setPlaylist((prevList) => {
          return prevList.filter((song) => song?.md5 !== track.md5)
        })
      }}
    />
  )
}
