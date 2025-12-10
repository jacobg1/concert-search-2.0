import {
  PlayerState,
  SessionState,
  type MediaHandler,
} from '../../../src/app/interface'
import { mediaHandlers } from '../../../src/app/mediaHandlers'
import {
  findAction,
  checkMediaSession,
  createMockAudioEl,
  contextRenderHook,
} from '../../utils'
import { useMediaHandlers, useMediaSession } from '../../../src/app/hooks'
import { renderHook } from '@testing-library/react'
import { singleConcert } from '@repo/mock-data/ui'

const resolve = () => Promise.resolve()

const mockDispatch = jest.fn()
const mockPlay = jest.fn(resolve)
const mockPause = jest.fn(resolve)

const mockAudioEl = createMockAudioEl({
  play: mockPlay,
  pause: mockPause,
})

describe('Media Handlers', () => {
  let handlers: MediaHandler[]

  beforeAll(() => {
    handlers = mediaHandlers(mockAudioEl, mockDispatch)
  })

  it('mediaHandlers function properly creates handlers', () => {
    expect(handlers.length).toBeGreaterThan(0)
  })

  it('mediaHandlers returns an empty array if no audio ref is passed in', () => {
    const emptyHandlers = mediaHandlers({ current: null }, mockDispatch)
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
    const play = findAction(PlayerState.Play, handlers)
    const pause = findAction(PlayerState.Pause, handlers)

    await checkMediaSession(SessionState.Paused)

    play.handler()

    await checkMediaSession(SessionState.Playing)

    pause.handler()
    await checkMediaSession(SessionState.Paused)
  })

  it('play handler handles errors properly', async () => {
    const play = findAction(PlayerState.Play, handlers)

    await checkMediaSession(SessionState.Paused)

    play.handler()

    await checkMediaSession(SessionState.Playing)

    mockPlay.mockRejectedValue(new Error('test error'))

    play.handler()

    await checkMediaSession(SessionState.Paused)
  })

  it('useMediaHandlers works properly', () => {
    const setHandlerSpy = jest.spyOn(
      navigator.mediaSession,
      'setActionHandler'
    )

    contextRenderHook(() => useMediaHandlers(mockAudioEl))

    handlers.forEach(({ action }, index) => {
      const [mockAction] = setHandlerSpy.mock.calls[index]
      expect(mockAction).toBe(action)
    })
  })

  it('useMediaSession sets the correct metadata', () => {
    const { metadata, trackList } = singleConcert

    const mockTitle = 'Tuning'
    const mockTrackName = 'Other Track Name'

    const expectedMetadata = {
      title: mockTitle,
      album: metadata.title,
      artist: metadata.creator,
    }

    expect(navigator.mediaSession.metadata).toStrictEqual({})

    const { rerender } = renderHook(
      ({ mockMetadata, mockTrackList, currentTrackName }) =>
        useMediaSession(mockMetadata, mockTrackList, currentTrackName),
      {
        initialProps: {
          mockMetadata: metadata,
          mockTrackList: trackList,
          currentTrackName: trackList[0].name,
        },
      }
    )

    expect(navigator.mediaSession.metadata).toEqual(expectedMetadata)

    rerender({
      mockMetadata: metadata,
      mockTrackList: trackList,
      currentTrackName: mockTrackName,
    })

    expect(navigator.mediaSession.metadata).toEqual({
      ...expectedMetadata,
      title: mockTrackName,
    })
  })
})
