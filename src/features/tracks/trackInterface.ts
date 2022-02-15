export interface TrackListData {
  name: string
  source: string
  creator: string
  title: string
  track: string
  album: string
  bitrate: string
  format: string
  original: string
  mtime: string
  size: string
  md5: string
  crc32: string
  sha1: string
  length: string
  height: string
  width: string
  link: string
}

export interface TrackMetadata {
  title: string
  numTracks: string
  creator: string
  description?: string
  date: string
  venue?: string
  source?: string
}

export interface TrackListDisplayProps {
  trackList: TrackListData[]
  currentTrackName: string
  playNewTrack: (name: string) => void
}
