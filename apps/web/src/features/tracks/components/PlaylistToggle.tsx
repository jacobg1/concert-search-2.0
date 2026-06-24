import AddBoxIcon from '@mui/icons-material/AddBox'
import RemoveIcon from '@mui/icons-material/Remove'
import type { PlaylistToggleProps } from '../trackInterface'

export function PlaylistToggle({
  add,
  md5,
  track,
  setPlaylist,
}: PlaylistToggleProps) {
  if (add) {
    return (
      <AddBoxIcon
        onClick={(e) => {
          e.stopPropagation()
          setPlaylist((prevList) => new Map(prevList.set(md5, track)))
        }}
      />
    )
  }

  return (
    <RemoveIcon
      onClick={(e) => {
        e.stopPropagation()
        setPlaylist((prevList) => {
          const newList = new Map(prevList)
          newList.delete(md5)
          return newList
        })
      }}
    />
  )
}
