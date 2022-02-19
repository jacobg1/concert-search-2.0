import { PlayerState, MediaFormat, NetworkError } from '../../../app/interface'
import { TrackMetadata, TrackListData } from '../../tracks/trackInterface'

export interface SelectedConcert {
  metadata: TrackMetadata | null
  trackList: TrackListData[]
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
  isDrawerOpen: boolean
  loading: boolean
  error: NetworkError | Record<string, never>
}
