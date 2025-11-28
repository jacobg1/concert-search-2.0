import '@testing-library/jest-dom'
import { SessionState } from '../../src/app/interface'
import type { MediaMetadataArgs } from '../types'

class MockMediaMetadata {
  album = ''
  artist = ''
  title = ''

  constructor({ album, artist, title }: MediaMetadataArgs) {
    if (album) this.album = album
    if (artist) this.artist = artist
    if (title) this.title = title
  }
}

beforeEach(() => {
  jest.clearAllMocks()

  Object.assign(navigator, {
    mediaSession: {
      playbackState: SessionState.Paused,
      setActionHandler: jest.fn(),
      metadata: {},
    },
  })

  Object.assign(window, {
    innerHeight: 300,
    innerWidth: 300,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })

  Object.assign(global, {
    MediaMetadata: MockMediaMetadata,
  })
})
