import { MediaFormat, PlayerState, SortOrder } from '../../src/app/interface'

export const defaultAppState = {
  individualConcert: {
    selectedConcert: { trackList: [], metadata: null },
    currentlyPlayingTrack: { currentTrackName: '', playUrl: '' },
    playerState: PlayerState.Pause,
    mediaFormat: MediaFormat.MP3,
    isDrawerOpen: false,
    loading: false,
    concertInitialized: false,
    error: {},
  },
  concertList: {
    concerts: [],
    concertQuery: {
      bandName: '',
      year: '',
      filterDuplicates: true,
      sortBy: { downloads: SortOrder.DESC },
    },
    loading: false,
    error: {},
    pageNumber: 1,
  },
  concertSelect: {
    bandList: {
      'Test Band One': ['2004', '2007', '2010'],
      'Test Band Two': ['1997', '2000', '2015'],
    },
    selectedBand: '',
    selectedYear: '',
    filterDuplicates: true,
  },
}
