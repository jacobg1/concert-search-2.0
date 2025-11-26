import { act, renderHook, waitFor } from '@testing-library/react'
import {
  usePlayPause,
  usePopover,
  useResize,
  useSongDuration,
  useVolumeChange,
} from '../../../src/app/hooks'
import {
  checkMediaSession,
  createTestEvent,
  createMockAudioEl,
} from '../../utils'
import { PlayerState, SessionState } from '../../../src/app/interface'
import type { UsePlayPauseArgs, UseSongDurationArgs } from '../../types'

const mockUrl = 'mock://url'

const initialProps = {
  url: mockUrl,
  state: PlayerState.Play,
}

const resolve = () => Promise.resolve()

const mockPlay = jest.fn(resolve)
const mockPause = jest.fn(resolve)

describe('Hooks', () => {
  it('useResize works properly', () => {
    const maxWidth = 900

    for (const { h, w } of [
      { h: 400, w: 300 },
      { h: 800, w: 800 },
      { h: 700, w: 1000 },
    ]) {
      Object.assign(window, {
        ...window,
        innerHeight: h,
        innerWidth: w,
      })

      const {
        result: {
          current: [height, width],
        },
      } = renderHook(() => useResize(maxWidth))

      expect(height).toBe(h)

      if (w < maxWidth) {
        expect(width).toBe(w)
      } else {
        expect(width).toBe(maxWidth)
      }
    }
  })

  it('usePopover works properly', () => {
    const testTarget = 'test target'
    const testEvent = createTestEvent(testTarget)

    const { result } = renderHook(() => usePopover<HTMLButtonElement>())

    const [htmlElOne, isOpenOne, handleOpen, handleClose] = result.current

    expect(htmlElOne).toBe(null)
    expect(isOpenOne).toBe(false)

    act(() => handleOpen(testEvent))

    const [htmlElTwo, isOpenTwo] = result.current

    expect(htmlElTwo).toBe(testTarget)
    expect(isOpenTwo).toBe(true)

    act(() => handleClose(testEvent))

    const [htmlElThree, isOpenThree] = result.current

    expect(htmlElThree).toBe(null)
    expect(isOpenThree).toBe(false)
  })

  it('useVolumeChange works properly', () => {
    const mockAudioEl = createMockAudioEl({ volume: 100 })

    renderHook(() => useVolumeChange(mockAudioEl, 1000, PlayerState.Play))

    expect(mockAudioEl.current?.volume).toBe(10)
  })

  it('useSongDuration works properly', () => {
    const mockDuration = 1000
    const mockAudioEl = createMockAudioEl({ duration: mockDuration })

    const { result } = renderHook(() =>
      useSongDuration(mockAudioEl, 'mock://url')
    )

    expect(result.current).toBe(0)

    act(() => mockAudioEl?.current?.onloadedmetadata?.({} as Event))

    expect(result.current).toBe(mockDuration)
  })

  it('useSongDuration resets duration when url is undefined', () => {
    const mockDuration = 100
    const mockAudioEl = createMockAudioEl({ duration: mockDuration })

    const { result, rerender } = renderHook<number, UseSongDurationArgs>(
      ({ url }) => useSongDuration(mockAudioEl, url),
      { initialProps: { url: mockUrl } }
    )

    expect(result.current).toBe(0)

    act(() => mockAudioEl?.current?.onloadedmetadata?.({} as Event))
    expect(result.current).toBe(mockDuration)

    act(() => rerender({ url: undefined }))
    expect(result.current).toBe(0)
  })

  it('usePlayPause works properly', async () => {
    const mockAudioEl = createMockAudioEl({
      play: mockPlay,
      pause: mockPause,
    })

    const { rerender } = renderHook<void, UsePlayPauseArgs>(
      ({ url, state }) => usePlayPause(mockAudioEl, url, state),
      { initialProps }
    )

    await waitFor(() => checkMediaSession(SessionState.Playing))
    expect(mockPlay).toHaveBeenCalledTimes(1)

    act(() => rerender({ url: mockUrl, state: PlayerState.Pause }))

    checkMediaSession(SessionState.Paused)
    expect(mockPause).toHaveBeenCalledTimes(1)
  })

  it('usePlayPause does nothing if no audio element is defined', () => {
    const mockAudioEl = { current: null }

    renderHook<void, UsePlayPauseArgs>(
      ({ url, state }) => usePlayPause(mockAudioEl, url, state),
      { initialProps }
    )

    checkMediaSession(SessionState.Paused)
    expect(mockPlay).not.toHaveBeenCalled()
    expect(mockPause).not.toHaveBeenCalled()
  })

  it('usePlayPause properly handles errors', async () => {
    const mockAudioEl = createMockAudioEl({
      play: mockPlay,
      pause: mockPause,
    })

    mockPlay.mockRejectedValue(new Error('test error'))

    renderHook<void, UsePlayPauseArgs>(
      ({ url, state }) => usePlayPause(mockAudioEl, url, state),
      { initialProps }
    )

    await mockPlay.withImplementation(resolve, resolve)

    checkMediaSession(SessionState.Paused)
    expect(mockPlay).toHaveBeenCalledTimes(1)
    expect(mockPause).not.toHaveBeenCalled()
  })
})
