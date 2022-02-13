import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { TrackListData, TrackMetadata } from '../tracks/trackInterface'
import { NetworkError, PlayerState } from '../../app/interface'

const { Play, Pause } = PlayerState

export interface SelectedConcert {
  metadata: TrackMetadata | null
  trackList: TrackListData[]
}

export const fetchSelectedConcert = createAsyncThunk(
  'selectedConcert/fetchselectedConcert',
  async (concertId: string, { rejectWithValue }) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/concerts/${concertId}/format/mp3`,
      {
        method: 'GET',
      }
    )
    if (response.ok) {
      return response.json() as Promise<SelectedConcert>
    }
    return rejectWithValue((await response.json()) as NetworkError)
  }
)

interface CurrentlyPlayingTrack {
  currentTrackName: string
  playUrl: string
}

interface SelectedConcertState {
  selectedConcert: SelectedConcert
  currentlyPlayingTrack: CurrentlyPlayingTrack
  playerState: PlayerState
  isDrawerOpen: boolean
  loading: boolean
  error: NetworkError | Record<string, unknown>
}

const initialState: SelectedConcertState = {
  selectedConcert: { trackList: [], metadata: null },
  currentlyPlayingTrack: { currentTrackName: '', playUrl: '' },
  playerState: Pause,
  isDrawerOpen: false,
  loading: false,
  error: {},
}

const findTrackIndex = (
  trackList: TrackListData[],
  currentTrackName: string
): number => {
  return trackList.findIndex(({ name }) => name === currentTrackName)
}

const selectedConcertSlice = createSlice({
  name: 'selectedConcert',
  initialState,
  reducers: {
    toggleConcertDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen
      if (state.currentlyPlayingTrack.playUrl) {
        state.playerState = !state.isDrawerOpen ? Pause : Play
      }
    },
    playNewTrack: (state, action: PayloadAction<string>) => {
      const {
        selectedConcert: { trackList },
      } = state

      const trackIndex = findTrackIndex(trackList, action.payload)

      state.currentlyPlayingTrack = {
        currentTrackName: action.payload,
        playUrl: trackList[trackIndex].link,
      }
      state.playerState = Play
    },
    playNextTrack: (state) => {
      const {
        selectedConcert: { trackList },
        currentlyPlayingTrack: { currentTrackName },
      } = state

      const trackIndex = findTrackIndex(trackList, currentTrackName)

      // Check whether we are at end of trackList
      // If so go to first track
      // Otherwise play next track
      const nextTrack =
        trackIndex === trackList.length - 1
          ? trackList[0]
          : trackList[trackIndex + 1]

      state.currentlyPlayingTrack = {
        currentTrackName: nextTrack.name,
        playUrl: nextTrack.link,
      }
      state.playerState = Play
    },
    playPreviousTrack: (state) => {
      const {
        selectedConcert: { trackList },
        currentlyPlayingTrack: { currentTrackName },
      } = state

      const trackIndex = findTrackIndex(trackList, currentTrackName)

      const previousTrack =
        trackIndex === 0
          ? trackList[trackList.length - 1]
          : trackList[trackIndex - 1]

      state.currentlyPlayingTrack = {
        currentTrackName: previousTrack.name,
        playUrl: previousTrack.link,
      }
      state.playerState = Play
    },
    setPlayerState: (state, action: PayloadAction<PlayerState>) => {
      // TODO: handle loading state?
      if (!state.currentlyPlayingTrack.playUrl) return
      state.playerState = action.payload
    },
  },
  extraReducers: {
    [fetchSelectedConcert.pending.type]: (state) => {
      state.currentlyPlayingTrack = { currentTrackName: '', playUrl: '' }
      state.isDrawerOpen = true
      state.loading = true
    },
    [fetchSelectedConcert.fulfilled.type]: (
      state,
      action: PayloadAction<SelectedConcert>
    ) => {
      state.selectedConcert = action.payload
      state.loading = false
    },
    [fetchSelectedConcert.rejected.type]: (
      state,
      action: { payload: NetworkError }
    ) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  toggleConcertDrawer,
  playNewTrack,
  setPlayerState,
  playNextTrack,
  playPreviousTrack,
} = selectedConcertSlice.actions

export default selectedConcertSlice.reducer
