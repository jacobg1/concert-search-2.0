import type { Dispatch, SetStateAction } from 'react'
import type { WritableDraft } from '@reduxjs/toolkit'

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
  playlist: PlaylistTrack[]
  setPlaylist: Dispatch<SetStateAction<PlaylistTrack[]>>
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
  playlist: PlaylistTrack[]
  setPlaylist: Dispatch<SetStateAction<PlaylistTrack[]>>
  playNewTrack: (name: string) => void
}

export type PlaylistTrack = {
  md5: string
  name: string
  title: string
  link: string
  length: string
}

export interface PlaylistToggleProps {
  add: boolean
  track: PlaylistTrack
  setPlaylist: Dispatch<SetStateAction<PlaylistTrack[]>>
}

type PlaylistAndTracklist = PlaylistTrack & TrackListData

export type Tracks = WritableDraft<PlaylistAndTracklist>[]
