import { TrackListData } from './trackInterface'

interface TrackListDisplayProps {
  trackList: TrackListData[]
}
export default function TrackListDisplay({
  trackList,
}: TrackListDisplayProps): JSX.Element | null {
  if (!trackList.length) return null
  return <h3>render trackList</h3>
}
