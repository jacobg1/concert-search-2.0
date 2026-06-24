import type { Dispatch, SetStateAction } from 'react'
import type { Playlist } from '../selectedConcert'

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
  playlist: Playlist
  setPlaylist: Dispatch<SetStateAction<Playlist>>
  currentTrackName: string
  playNewTrack: (name: string) => void
}

export interface SingleTrackProps {
  name: string
  link: string
  title: string
  length: string
  currentTrackName: string
  md5: string
  playlist: Playlist
  setPlaylist: Dispatch<SetStateAction<Playlist>>
  playNewTrack: (name: string) => void
}

type PlaylistTrack = {
  title: string
  link: string
  length: string
}

export interface PlaylistToggleProps {
  add: boolean
  md5: string
  track: PlaylistTrack
  setPlaylist: Dispatch<SetStateAction<Playlist>>
}
