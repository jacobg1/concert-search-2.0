import {
  PlayerState,
  MediaFormat,
  type NetworkError,
  IconDirection,
} from '../../../app/interface'
import type {
  TrackMetadata,
  TrackListData,
  PlaylistTrack,
} from '../../tracks/trackInterface'

export interface SelectedConcert {
  metadata: TrackMetadata | null
  trackList: TrackListData[]
  playlist?: PlaylistTrack[]
}

export interface CurrentlyPlayingTrack {
  currentTrackName: string
  playUrl: string
}

export interface SelectedConcertState {
  selectedConcert: SelectedConcert
  currentlyPlayingTrack: CurrentlyPlayingTrack
  playerState: PlayerState
  mediaFormat: MediaFormat
  showPlaylist: boolean
  isDrawerOpen: boolean
  concertInitialized: boolean
  loading: boolean
  error: NetworkError | Record<string, never>
}

export type Playlist = Map<
  string,
  {
    md5: string
    title: string
    link: string
    length: string
  }
>

export interface ButtonContainerProps {
  showPlaylist: boolean
  playlist?: PlaylistTrack[]
  tracklist?: TrackListData[]
}

export interface BackButtonProps {
  iconDirection: IconDirection
  hasTracklist?: number
}
