import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { TrackListData, TrackMetaData } from '../tracks/trackInterface'
import { PlayerState } from '../../app/interface'
import { PlayArrowTwoTone } from '@mui/icons-material'

const { Play, Pause } = PlayerState

export interface SelectedConcert {
  metaData: TrackMetaData | null
  trackList: TrackListData[]
}

export const fetchSelectedConcert = createAsyncThunk(
  'selectedConcert/fetchselectedConcert',
  async (concertId: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/concert/${concertId}`,
      {
        method: 'GET',
      }
    )
    return response.json() as Promise<SelectedConcert>
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
  error: Error | Record<string, unknown>
}

const initialState: SelectedConcertState = {
  selectedConcert: { trackList: [], metaData: null },
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
        playUrl: trackList[trackIndex].playUrl,
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
        playUrl: nextTrack.playUrl,
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
        playUrl: previousTrack.playUrl,
      }
      state.playerState = Play
    },
    setPlayerState: (state, action: PayloadAction<PlayerState>) => {
      // TODO: play first song instead if none are selected
      // TODO: handle loading state?
      if (!state.currentlyPlayingTrack.playUrl) return
      state.playerState = action.payload
    },
  },
  extraReducers: {
    // Loading
    [fetchSelectedConcert.pending.type]: (state) => {
      state.currentlyPlayingTrack = { currentTrackName: '', playUrl: '' }
      state.isDrawerOpen = true
      state.loading = true
    },
    // Success
    [fetchSelectedConcert.fulfilled.type]: (
      state,
      action: PayloadAction<SelectedConcert>
    ) => {
      state.selectedConcert = action.payload
      state.loading = false
    },
    // Error
    [fetchSelectedConcert.rejected.type]: (state, action) => {
      // show error toast on error?
      state.error = action.error
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
