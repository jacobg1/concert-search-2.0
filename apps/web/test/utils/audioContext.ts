import type { TestAudioContextArgs } from '../types'
import { MockAudioDestination, MockAnalyzerNode } from './mocks'

const destination = new MockAudioDestination()

export function testAudioContext({
  current: [binCount, analyser],
  unmount,
  connect,
  disconnect,
}: TestAudioContextArgs) {
  const fftSize = 256
  const frequencyBinCount = 8

  expect(analyser).toBeDefined()
  expect(analyser).toBeInstanceOf(MockAnalyzerNode)
  expect(analyser?.fftSize).toBe(fftSize)
  expect(binCount).toBe(frequencyBinCount)

  expect(connect.source).toHaveBeenCalledWith(analyser)
  expect(connect.analyser).toHaveBeenCalledWith(destination)

  unmount()

  expect(disconnect.source).toHaveBeenCalledWith(analyser)
  expect(disconnect.analyser).toHaveBeenCalledWith(destination)
}
