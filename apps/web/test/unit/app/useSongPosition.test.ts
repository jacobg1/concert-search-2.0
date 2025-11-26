import { act } from '@testing-library/react'
import { useSongPosition } from '../../../src/app/hooks'
import { contextRenderHook, createMockAudioEl } from '../../utils'
import { PlayerState, SongPosition } from '../../../src/app/interface'
import type { SelectedConcertState } from '../../../src/features'

const mockUrl = 'mock://url'

const resolve = () => Promise.resolve()

const mockPlay = jest.fn(resolve)
const mockPause = jest.fn(resolve)

describe('useSongPosition', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('useSongPosition properly returns song position', () => {
    const mockCurrentTime = 300

    const mockAudioEl = createMockAudioEl({
      played: true,
      currentTime: mockCurrentTime,
    })

    const { result } = contextRenderHook<SongPosition, undefined>(() =>
      useSongPosition(mockAudioEl, mockUrl, PlayerState.Play)
    )

    const [initialPosition] = result.current
    expect(initialPosition).toBe(0)

    act(() => mockAudioEl.current?.ontimeupdate?.({} as Event))

    const [newPosition] = result.current
    expect(newPosition).toBe(mockCurrentTime)
  })

  it('useSongPosition properly pauses song when onstalled event is called', () => {
    const mockAudioEl = createMockAudioEl({
      play: mockPlay,
      pause: mockPause,
      paused: false,
    })

    const { store } = contextRenderHook<SongPosition, undefined>(
      () => useSongPosition(mockAudioEl, mockUrl, PlayerState.Play),
      {
        preloadedState: {
          individualConcert: {
            currentlyPlayingTrack: { playUrl: mockUrl },
            playerState: PlayerState.Play,
          } as SelectedConcertState,
        },
      }
    )

    const {
      individualConcert: { playerState: initialState },
    } = store.getState()

    expect(initialState).toBe(PlayerState.Play)

    act(() => mockAudioEl.current?.onstalled?.({} as Event))

    const {
      individualConcert: { playerState: pausedState },
    } = store.getState()

    expect(pausedState).toBe(PlayerState.Pause)
    expect(mockPause).toHaveBeenCalledTimes(1)

    jest.runOnlyPendingTimers()

    const {
      individualConcert: { playerState: playedState },
    } = store.getState()

    expect(playedState).toBe(PlayerState.Play)
    expect(mockPlay).toHaveBeenCalledTimes(1)
  })
})
