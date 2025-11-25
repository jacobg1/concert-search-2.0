import '@testing-library/jest-dom'

Object.assign(navigator, {
  mediaSession: {
    playbackState: 'paused',
    setActionHandler: jest.fn(),
    metadata: {},
  },
})
