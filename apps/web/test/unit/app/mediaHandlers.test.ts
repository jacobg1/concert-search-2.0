import { RefObject } from 'react'
import type { MediaHandler } from '../../../src/app/interface'
import { mediaHandlers } from '../../../src/app/mediaHandlers'
import { findAction, checkMediaSession } from '../../utils'

const mockDispatch = jest.fn()
const mockPlay = jest.fn(() => Promise.resolve())
const mockPause = jest.fn(() => Promise.resolve())

const mockAudioEl = {
  current: {
    play: mockPlay,
    pause: mockPause,
  } as unknown as HTMLMediaElement,
}

describe('Media Handlers', () => {
  let handlers: MediaHandler[]

  beforeAll(() => {
    handlers = mediaHandlers(mockAudioEl, mockDispatch)
  })

  beforeEach(() => {
    navigator.mediaSession.playbackState = 'paused'
  })

  it('mediaHandlers function properly creates handlers', () => {
    expect(handlers.length).toBeGreaterThan(0)
  })

  it('mediaHandlers returns an empty array if no audio ref is passed in', () => {
    const emptyHandlers = mediaHandlers(
      { current: null } as unknown as RefObject<HTMLMediaElement>,
      mockDispatch
    )
    expect(emptyHandlers.length).toBe(0)
  })

  it('action handlers properly dispatch actions', () => {
    for (const { name, mock } of [
      { name: 'play', mock: mockPlay },
      { name: 'pause', mock: mockPause },
      { name: 'previoustrack', mock: mockDispatch },
      { name: 'nexttrack', mock: mockDispatch },
    ]) {
      const { action, handler } = findAction(
        name as MediaSessionAction,
        handlers
      )

      handler()

      expect(action).toBe(name)
      expect(mock).toHaveBeenCalledTimes(1)
      mock.mockClear()
    }
  })

  it('mediaSession playbackState is set properly by action handlers', async () => {
    const play = findAction('play', handlers)
    const pause = findAction('pause', handlers)

    checkMediaSession('paused')

    play.handler()

    await mockPlay.withImplementation(
      () => Promise.resolve(),
      async () => {
        await mockPlay()
        checkMediaSession('playing')
      }
    )

    pause.handler()
    checkMediaSession('paused')
  })

  it('play handler handles errors properly', async () => {
    const play = findAction('play', handlers)

    checkMediaSession('paused')

    play.handler()

    await mockPlay.withImplementation(
      () => Promise.resolve(),
      async () => {
        await mockPlay()
        checkMediaSession('playing')
      }
    )

    mockPlay.mockRejectedValue(new Error('test error'))

    play.handler()

    await mockPlay.withImplementation(
      () => Promise.resolve(),
      () => mockPlay()
    )

    checkMediaSession('paused')
  })
})
