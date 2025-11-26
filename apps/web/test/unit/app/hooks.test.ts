import { act, renderHook } from '@testing-library/react'
import {
  usePopover,
  useResize,
  useSongDuration,
  useVolumeChange,
} from '../../../src/app/hooks'
import { createTestEvent } from '../../utils'
import { PlayerState } from '../../../src/app/interface'
import type { RefObject } from 'react'

const oldWindow = { ...window }

describe('Hooks', () => {
  beforeEach(() => Object.assign(window, oldWindow))

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
    const mockAudioEl = {
      current: { volume: 100 },
    } as RefObject<HTMLAudioElement>

    renderHook(() => useVolumeChange(mockAudioEl, 1000, PlayerState.Play))

    expect(mockAudioEl.current?.volume).toBe(10)
  })

  it('useSongDuration works properly', () => {
    const mockDuration = 1000

    const mockAudioEl = {
      current: {
        duration: mockDuration,
        onloadedmetadata: null,
      },
    } as RefObject<HTMLAudioElement>

    const { result } = renderHook(() =>
      useSongDuration(mockAudioEl, 'mock://url')
    )

    expect(result.current).toBe(0)

    act(() => mockAudioEl?.current?.onloadedmetadata?.({} as Event))

    expect(result.current).toBe(mockDuration)
  })

  it('useSongDuration resets duration when url is undefined', () => {
    const mockDuration = 100

    const mockAudioEl = {
      current: {
        duration: mockDuration,
        onloadedmetadata: null,
      },
    } as RefObject<HTMLAudioElement>

    const { result, rerender } = renderHook<number, { url?: string }>(
      ({ url }) => useSongDuration(mockAudioEl, url),
      { initialProps: { url: 'mock://url' } }
    )

    expect(result.current).toBe(0)

    act(() => mockAudioEl?.current?.onloadedmetadata?.({} as Event))

    expect(result.current).toBe(mockDuration)

    rerender({ url: undefined })

    expect(result.current).toBe(0)
  })
})
