import '@testing-library/jest-dom'

Object.assign(navigator, {
  mediaSession: {
    playbackState: 'paused',
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
