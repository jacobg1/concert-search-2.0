import { handleTrackDuration } from '../../../src/app/util'

describe('Util', () => {
  it('handleTrackDuration works properly', () => {
    const durations = [
      { test: '03:36', expected: '03:36' },
      { test: '247.56', expected: '04:07' },
      { test: '134.42', expected: '02:14' },
      { test: '430.9', expected: '07:10' },
    ]

    durations.forEach(({ test, expected }) => {
      expect(handleTrackDuration(test)).toBe(expected)
    })
  })
})
