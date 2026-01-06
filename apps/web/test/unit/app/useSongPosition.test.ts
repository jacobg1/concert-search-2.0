import { act } from '@testing-library/react'
import { useSongPosition } from '../../../src/app/hooks'
import {
  checkMediaSession,
  contextRenderHook,
  createMockAudioEl,
  getPlayerState,
} from '../../utils'
import {
  PlayerState,
  SessionState,
  SongPosition,
} from '../../../src/app/interface'
import type { SelectedConcertState } from '../../../src/features'
import type { RenderHookArgs } from '../../types'

const mockUrl = 'mock://url'
const mockPlay = jest.fn(() => Promise.resolve())
const mockPause = jest.fn(() => Promise.resolve())

const initialSongPosition = 0

describe('useSongPosition', () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(() => jest.useRealTimers())

  it('useSongPosition properly returns song position', () => {
    const mockCurrentTime = 300

    const mockAudioEl = createMockAudioEl({
      played: true,
      currentTime: mockCurrentTime,
    })

    const { result, rerender } = contextRenderHook<
      SongPosition,
      RenderHookArgs
    >(({ audioEl, url, state }) => useSongPosition(audioEl, url, state), {
      initialProps: {
        audioEl: mockAudioEl,
        url: mockUrl,
        state: PlayerState.Play,
      },
    })

    expect(result.current[0]).toBe(initialSongPosition)

    act(() => mockAudioEl.current?.ontimeupdate?.({} as Event))
    expect(result.current[0]).toBe(mockCurrentTime)

    const missingTimeEl = createMockAudioEl({
      played: true,
      currentTime: undefined,
    })

    rerender({
      audioEl: missingTimeEl,
      url: mockUrl,
      state: PlayerState.Play,
    })

    act(() => missingTimeEl.current?.ontimeupdate?.({} as Event))
    expect(result.current[0]).toBe(0)
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

    expect(getPlayerState(store)).toBe(PlayerState.Play)

    act(() => mockAudioEl.current?.onstalled?.({} as Event))

    expect(getPlayerState(store)).toBe(PlayerState.Pause)
    expect(mockPause).toHaveBeenCalledTimes(1)

    jest.runOnlyPendingTimers()

    expect(getPlayerState(store)).toBe(PlayerState.Play)
    expect(mockPlay).toHaveBeenCalledTimes(1)
  })

  it('setSongPosition properly sets the song position', async () => {
    const mockCurrentTime = 700
    const mockSongPosition = 900

    const mockAudioEl = createMockAudioEl({
      play: mockPlay,
      pause: mockPause,
      currentTime: mockCurrentTime,
    })

    const { result } = contextRenderHook<SongPosition, undefined>(() =>
      useSongPosition(mockAudioEl, mockUrl, PlayerState.Play)
    )

    const [position, setSongPosition] = result.current

    await checkMediaSession(SessionState.Paused)

    expect(position).toBe(initialSongPosition)
    expect(mockAudioEl.current?.currentTime).toBe(mockCurrentTime)

    act(() => setSongPosition(mockSongPosition))

    expect(result.current[0]).toBe(mockSongPosition)
    expect(mockAudioEl.current?.currentTime).toBe(mockSongPosition)
    expect(mockPause).toHaveBeenCalledTimes(1)
    expect(mockPlay).toHaveBeenCalledTimes(1)

    await checkMediaSession(SessionState.Playing)
  })

  it('restSongPosition properly resets the song position', () => {
    const mockSongPosition = 900

    const mockAudioEl = createMockAudioEl({
      play: mockPlay,
      pause: mockPause,
      currentTime: 500,
    })

    const { result } = contextRenderHook<SongPosition, undefined>(() =>
      useSongPosition(mockAudioEl, mockUrl, PlayerState.Play)
    )

    const [, setSongPosition, resetSongPosition] = result.current

    act(() => setSongPosition(mockSongPosition))
    expect(result.current[0]).toBe(mockSongPosition)
    expect(mockAudioEl.current?.currentTime).toBe(mockSongPosition)

    act(() => resetSongPosition())
    expect(result.current[0]).toBe(initialSongPosition)
    expect(mockAudioEl.current?.currentTime).toBe(initialSongPosition)
  })

  it('resetSongPosition does nothing if audio element is undefined', () => {
    const mockSongPosition = 80

    const mockAudioEl = createMockAudioEl({
      play: mockPlay,
      pause: mockPause,
      currentTime: 500,
    })

    const { result, rerender } = contextRenderHook<
      SongPosition,
      RenderHookArgs
    >(({ audioEl, url, state }) => useSongPosition(audioEl, url, state), {
      initialProps: {
        audioEl: mockAudioEl,
        url: mockUrl,
        state: PlayerState.Play,
      },
    })

    const [, setSongPosition] = result.current

    act(() => setSongPosition(mockSongPosition))
    expect(result.current[0]).toBe(mockSongPosition)
    expect(mockAudioEl.current?.currentTime).toBe(mockSongPosition)

    rerender({
      audioEl: { current: null },
      url: mockUrl,
      state: PlayerState.Play,
    })

    const [, , resetSongPosition] = result.current

    act(() => resetSongPosition())
    expect(result.current[0]).toBe(mockSongPosition)
    expect(mockAudioEl.current?.currentTime).toBe(mockSongPosition)
  })
})
