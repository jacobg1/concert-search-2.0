import { MediaFormat, PlayerState, SortOrder } from '../../src/app/interface'
import type { MediaMetadataArgs, MockSingleTrackProps } from '../types'

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

export class MockMediaMetadata {
  public album = ''
  public artist = ''
  public title = ''

  constructor({ album, artist, title }: MediaMetadataArgs) {
    if (album) this.album = album
    if (artist) this.artist = artist
    if (title) this.title = title
  }
}

// Just a placeholder for now since this class
// is only used as a function argument
export class MockAudioDestination {
  public init = false

  constructor() {
    this.init = true
  }
}

export class MockAnalyzerNode {
  public _fftSize: number = 0
  public frequencyBinCount: number = 8

  connect(): void {
    return
  }

  disconnect(): void {
    return
  }

  getByteFrequencyData(): void {
    return
  }

  get fftSize() {
    return this._fftSize
  }

  set fftSize(val: number) {
    this._fftSize = val
  }
}

export class MockSourceNode {
  readonly mediaElement: HTMLMediaElement | null = null

  connect(): void {
    return
  }

  disconnect(): void {
    return
  }

  constructor(el: HTMLAudioElement) {
    this.mediaElement = el
  }
}

export class MockAudioContext {
  public destination: MockAudioDestination | null = null

  constructor() {
    this.destination = new MockAudioDestination()
  }

  createMediaElementSource(el: HTMLAudioElement) {
    return new MockSourceNode(el)
  }

  createAnalyser(): MockAnalyzerNode {
    return new MockAnalyzerNode()
  }

  async resume(): Promise<void> {
    return
  }
}

export function getMockSingleTrackProps({
  playNewTrack,
  isPlaying,
  title,
  length,
}: MockSingleTrackProps) {
  const name = 'test name'
  const currentTrackName = isPlaying ? name : 'current'

  return {
    name,
    currentTrackName,
    playNewTrack,
    ...(title && { title }),
    ...(length && { length }),
  }
}

export function mockConcertListPayload(
  selectedBand: string,
  selectedYear?: string
) {
  const body = {
    searchTerm: selectedYear
      ? `${selectedBand}+AND+year%3A${selectedYear}`
      : selectedBand,
    max: 1000,
    filterDuplicates: true,
    sortBy: { downloads: SortOrder.DESC },
    mediaFormat: [MediaFormat.OGG, MediaFormat.MP3],
  }

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
