import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import {
  MediaFormat,
  NetworkError,
  PlayerState,
} from '../../app/interface'
import {
  SelectedConcert,
  SelectedConcertState,
} from './interface/selectedConcertInterface'
import {
  findNewTrack,
  findTrackIndex,
  findNextTrack,
  findPreviousTrack,
  addSongFormat,
} from '../../app/util'
import type { PlaylistTrack, Tracks } from '../tracks'

const { Play, Pause } = PlayerState

export const fetchSelectedConcert = createAsyncThunk(
  'selectedConcert/fetchSelectedConcert',
  async (concertId: string, { rejectWithValue }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/concerts/${concertId}`,
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
  selectedConcert: { trackList: [], playlist: [], metadata: null },
  usePlaylist: false,
  currentlyPlayingTrack: { currentTrackName: '', playUrl: '' },
  playerState: Pause,
  mediaFormat: MediaFormat.MP3,
  isDrawerOpen: false,
  loading: false,
  concertInitialized: false,
  error: {},
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
    playNewTrack: (state, action: PayloadAction<string | undefined>) => {
      const {
        selectedConcert: { trackList, playlist },
        mediaFormat,
        usePlaylist,
      } = state

      const tracks = usePlaylist ? playlist : trackList

      const newTrack = findNewTrack(tracks as Tracks, action.payload)

      state.currentlyPlayingTrack = {
        currentTrackName: newTrack.name,
        playUrl: addSongFormat(newTrack.link, mediaFormat),
      }
      state.playerState = Play
    },
    playNextTrack: (state) => {
      const {
        selectedConcert: { trackList, playlist },
        currentlyPlayingTrack: { currentTrackName },
        mediaFormat,
        usePlaylist,
      } = state

      const tracks = usePlaylist ? playlist : trackList

      const trackIndex = findTrackIndex(tracks as Tracks, currentTrackName)

      const nextTrack = findNextTrack(
        tracks as Tracks,
        trackIndex,
        currentTrackName
      )

      state.currentlyPlayingTrack = {
        currentTrackName: nextTrack.name,
        playUrl: addSongFormat(nextTrack.link, mediaFormat),
      }
      state.playerState = Play
    },
    playPreviousTrack: (state) => {
      const {
        selectedConcert: { trackList, playlist },
        currentlyPlayingTrack: { currentTrackName },
        mediaFormat,
        usePlaylist,
      } = state

      const tracks = usePlaylist ? playlist : trackList

      const trackIndex = findTrackIndex(tracks as Tracks, currentTrackName)

      const previousTrack = findPreviousTrack(
        tracks as Tracks,
        trackIndex,
        currentTrackName
      )

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
    setConcertInitialized: (state) => {
      if (!state.concertInitialized) {
        state.concertInitialized = true
      }
    },
    setPlaylist: (state, action: PayloadAction<PlaylistTrack[]>) => {
      state.selectedConcert.playlist = action.payload
    },
    setUsePlaylist: (state, action: PayloadAction<boolean>) => {
      state.usePlaylist = action.payload
    },
    clearSelectedConcertError: (state) => {
      state.error = {}
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
          state.selectedConcert = {
            ...action.payload,
            playlist: state.selectedConcert.playlist || [],
          }
          state.loading = false
          state.concertInitialized = initialState.concertInitialized
          state.playerState = initialState.playerState
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
  setConcertInitialized,
  setPlaylist,
  setUsePlaylist,
  clearSelectedConcertError,
} = selectedConcertSlice.actions

export default selectedConcertSlice.reducer
