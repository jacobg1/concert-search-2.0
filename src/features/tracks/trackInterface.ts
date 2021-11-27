export interface TrackListData {
  name: string
  playUrl: string
  title: string
  creator: string
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
  length?: string
  height?: string
  width?: string
}

export interface TrackMetaData {
  identifier: string
  title: string
  creator: string
  mediatype: string
  collection?: string[]
  type?: string
  description: string
  date?: string
  year?: string
  subject?: string
  publicdate?: string
  addeddate?: string
  uploader?: string
  venue?: string
  coverage?: string
  source?: string
  lineage?: string
  taper?: string
  transferer?: string
  updatedate?: string
  updater?: string
  backup_location?: string
}
