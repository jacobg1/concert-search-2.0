export interface TrackListData {
  name: string
  playUrl: string
  title: string
  creator: string
  length: string
  source?: string
  track?: string
  album?: string
  bitrate?: string
  format?: string
  original?: string
  mtime?: string
  size?: string
  md5?: string
  crc32?: string
  sha1?: string
  height?: string
  width?: string
}

export interface TrackMetaData {
  title: string
  numTracks: string
  creator: string
  description?: string
  date: string
  venue?: string
  source?: string
}
