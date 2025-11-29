import '@testing-library/jest-dom'
import { SessionState } from '../../src/app/interface'
import { MockMediaMetadata, MockAudioContext } from '../utils'

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
    webkitAudioContext: MockAudioContext,
  })

  Object.assign(global, {
    MediaMetadata: MockMediaMetadata,
    AudioContext: MockAudioContext,
  })
})
