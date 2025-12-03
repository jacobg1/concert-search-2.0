import { act, renderHook } from '@testing-library/react'
import {
  createMockAudioEl,
  MockAnalyzerNode,
  MockSourceNode,
  MockAudioContext,
  testAudioContext,
} from '../../utils'
import { useAudioContext } from '../../../src/app/hooks'

const sourceConnect = jest.spyOn(MockSourceNode.prototype, 'connect')
const sourceDisconnect = jest.spyOn(MockSourceNode.prototype, 'disconnect')

const analyserConnect = jest.spyOn(MockAnalyzerNode.prototype, 'connect')
const analyserDisconnect = jest.spyOn(MockAnalyzerNode.prototype, 'disconnect')

const contextResume = jest.spyOn(MockAudioContext.prototype, 'resume')

const mockAudioEl = createMockAudioEl()

describe('useAudioContext', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('useAudioContext properly returns analyzer node', async () => {
    const {
      result: { current },
      unmount,
    } = renderHook(() => useAudioContext(mockAudioEl))

    await act(() => mockAudioEl.current?.onplay?.({} as Event))

    expect(contextResume).toHaveBeenCalledTimes(1)

    testAudioContext({
      unmount,
      current,
      connect: {
        source: sourceConnect,
        analyser: analyserConnect,
      },
      disconnect: {
        source: sourceDisconnect,
        analyser: analyserDisconnect,
      },
    })
  })

  it('useAudioContext does nothing if no audio element is defined', () => {
    const {
      result: {
        current: [binCount, analyser],
      },
      unmount,
    } = renderHook(() => useAudioContext({ current: null }))

    expect(binCount).toBe(0)
    expect(analyser).not.toBeDefined()
    expect(sourceConnect).not.toHaveBeenCalled()
    expect(analyserConnect).not.toHaveBeenCalled()

    unmount()

    expect(sourceDisconnect).not.toHaveBeenCalled()
    expect(analyserDisconnect).not.toHaveBeenCalled()
  })

  it('useAudioContext works with legacy webkitAudioContext', async () => {
    Object.assign(global, {
      ...global,
      AudioContext: undefined,
    })

    const {
      result: { current },
      unmount,
    } = renderHook(() => useAudioContext(mockAudioEl))

    await act(() => mockAudioEl.current?.onplay?.({} as Event))

    expect(contextResume).toHaveBeenCalledTimes(1)

    testAudioContext({
      current,
      unmount,
      connect: {
        source: sourceConnect,
        analyser: analyserConnect,
      },
      disconnect: {
        source: sourceDisconnect,
        analyser: analyserDisconnect,
      },
    })
  })
})
