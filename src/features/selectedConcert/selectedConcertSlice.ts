import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { TrackListData } from '../tracks/trackInterface'
import { MediaFormat, NetworkError, PlayerState } from '../../app/interface'
import {
  SelectedConcert,
  SelectedConcertState,
} from './interface/selectedConcertInterface'

const { Play, Pause } = PlayerState

export const fetchSelectedConcert = createAsyncThunk(
  'selectedConcert/fetchSelectedConcert',
  async (concertId: string, { rejectWithValue }) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/concerts/${concertId}`,
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

const initialState: SelectedConcertState = {
  selectedConcert: { trackList: [], metadata: null },
  currentlyPlayingTrack: { currentTrackName: '', playUrl: '' },
  playerState: Pause,
  mediaFormat: MediaFormat.MP3,
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

// Replace file extension with currently selected media format
const addSongFormat = (src: string, format: MediaFormat): string => {
  return src.replace(/\.[^/.]+$/, `.${format}`)
}

const selectedConcertSlice = createSlice({
  name: 'selectedConcert',
  initialState,
  reducers: {
    toggleConcertDrawer: (state) => {
      // Can mutate state here with immerjs
      state.isDrawerOpen = !state.isDrawerOpen
    },
    changeMediaFormat: (state, action: PayloadAction<MediaFormat>) => {
      // TODO: show toast when changing format to let user know when it takes effect
      state.mediaFormat = action.payload
    },
    playNewTrack: (state, action: PayloadAction<string>) => {
      const {
        selectedConcert: { trackList },
        mediaFormat,
      } = state
      const trackIndex = findTrackIndex(trackList, action.payload)

      state.currentlyPlayingTrack = {
        currentTrackName: action.payload,
        playUrl: addSongFormat(trackList[trackIndex].link, mediaFormat),
      }
      state.playerState = Play
    },
    playNextTrack: (state) => {
      const {
        selectedConcert: { trackList },
        currentlyPlayingTrack: { currentTrackName },
        mediaFormat,
      } = state
      const trackIndex = findTrackIndex(trackList, currentTrackName)

      // Check whether we are at end of trackList
      // If so go to first track, otherwise play next track
      const nextTrack =
        trackIndex === trackList.length - 1
          ? trackList[0]
          : trackList[trackIndex + 1]

      state.currentlyPlayingTrack = {
        currentTrackName: nextTrack.name,
        playUrl: addSongFormat(nextTrack.link, mediaFormat),
      }
      state.playerState = Play
    },
    playPreviousTrack: (state) => {
      const {
        selectedConcert: { trackList },
        currentlyPlayingTrack: { currentTrackName },
        mediaFormat,
      } = state
      const trackIndex = findTrackIndex(trackList, currentTrackName)

      const previousTrack =
        trackIndex === 0
          ? trackList[trackList.length - 1]
          : trackList[trackIndex - 1]

      state.currentlyPlayingTrack = {
        currentTrackName: previousTrack.name,
        playUrl: addSongFormat(previousTrack.link, mediaFormat),
      }
      state.playerState = Play
    },
    setPlayerState: (state, action: PayloadAction<PlayerState>) => {
      // TODO: handle loading state?
      if (!state.currentlyPlayingTrack.playUrl) return
      state.playerState = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedConcert.pending, (state) => {
        state.currentlyPlayingTrack = { currentTrackName: '', playUrl: '' }
        state.isDrawerOpen = true
        state.loading = true
      })
      .addCase(
        fetchSelectedConcert.fulfilled,
        (state, action: PayloadAction<SelectedConcert>) => {
          state.selectedConcert = action.payload
          state.loading = false
        }
      )
      .addCase(fetchSelectedConcert.rejected, (state, action) => {
        state.error = action.payload as NetworkError
        state.loading = false
      })
  },
})

export const {
  toggleConcertDrawer,
  playNewTrack,
  setPlayerState,
  playNextTrack,
  playPreviousTrack,
  changeMediaFormat,
} = selectedConcertSlice.actions

export default selectedConcertSlice.reducer
