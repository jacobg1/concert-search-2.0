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
  selectedConcert: { trackList: [], metadata: null },
  currentlyPlayingTrack: { currentTrackName: '', playUrl: '' },
  playerState: Pause,
  mediaFormat: MediaFormat.MP3,
  isDrawerOpen: false,
  loading: false,
  concertInitialized: false,
  error: {},
}

function findTrackIndex(
  trackList: TrackListData[],
  currentTrackName: string
): number {
  return trackList.findIndex(({ name }) => name === currentTrackName)
}

function findPreviousTrack(
  trackList: TrackListData[],
  trackIndex: number,
  currentTrackName?: string
): TrackListData {
  if (!currentTrackName) return trackList[0]

  const isFirstTrack = trackIndex === 0

  if (isFirstTrack) {
    return trackList[trackList.length - 1]
  }

  return trackList[trackIndex - 1]
}

function findNextTrack(
  trackList: TrackListData[],
  trackIndex: number,
  currentTrackName?: string
): TrackListData {
  if (!currentTrackName) return trackList[0]

  const isLastTrack = trackIndex === trackList.length - 1

  if (isLastTrack) return trackList[0]

  return trackList[trackIndex + 1]
}

function findNewTrack(
  trackList: TrackListData[],
  currentTrackName?: string
): TrackListData {
  if (!currentTrackName) return trackList[0]

  const trackIndex = findTrackIndex(trackList, currentTrackName)

  return trackList[trackIndex]
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
    playNewTrack: (state, action: PayloadAction<string | undefined>) => {
      const {
        selectedConcert: { trackList },
        mediaFormat,
      } = state

      const newTrack = findNewTrack(trackList, action.payload)

      state.currentlyPlayingTrack = {
        currentTrackName: newTrack.name,
        playUrl: addSongFormat(newTrack.link, mediaFormat),
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

      const nextTrack = findNextTrack(trackList, trackIndex, currentTrackName)

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

      const previousTrack = findPreviousTrack(
        trackList,
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
} = selectedConcertSlice.actions

export default selectedConcertSlice.reducer
