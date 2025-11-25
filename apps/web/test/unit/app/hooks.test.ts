import { renderHook } from '@testing-library/react'
import { useResize } from '../../../src/app/hooks'

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
})
