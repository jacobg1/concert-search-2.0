import { act, renderHook } from '@testing-library/react'
import {
  createMockAudioEl,
  MockAnalyzerNode,
  MockSourceNode,
  MockAudioDestination,
  MockAudioContext,
} from '../../utils'
import { useAudioContext } from '../../../src/app/hooks'

const fftSize = 256
const frequencyBinCount = 8

const sourceConnect = jest.spyOn(MockSourceNode.prototype, 'connect')
const sourceDisconnect = jest.spyOn(MockSourceNode.prototype, 'disconnect')

const analyserConnect = jest.spyOn(MockAnalyzerNode.prototype, 'connect')
const analyserDisconnect = jest.spyOn(MockAnalyzerNode.prototype, 'disconnect')

const contextResume = jest.spyOn(MockAudioContext.prototype, 'resume')

const destination = new MockAudioDestination()
const mockAudioEl = createMockAudioEl()

describe('useAudioContext', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('useAudioContext properly returns analyzer node', async () => {
    const {
      result: {
        current: [binCount, analyser],
      },
      unmount,
    } = renderHook(() => useAudioContext(mockAudioEl))

    await act(() => mockAudioEl.current?.onplay?.({} as Event))

    expect(contextResume).toHaveBeenCalledTimes(1)
    expect(analyser).toBeDefined()
    expect(analyser).toBeInstanceOf(MockAnalyzerNode)
    expect(analyser?.fftSize).toBe(fftSize)
    expect(binCount).toBe(frequencyBinCount)
    expect(sourceConnect).toHaveBeenCalledWith(analyser)
    expect(analyserConnect).toHaveBeenCalledWith(destination)

    unmount()

    expect(sourceDisconnect).toHaveBeenCalledWith(analyser)
    expect(analyserDisconnect).toHaveBeenCalledWith(destination)
  })
})
