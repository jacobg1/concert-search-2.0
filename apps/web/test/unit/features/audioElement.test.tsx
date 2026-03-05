import { render } from '@testing-library/react'
import { createMockAudioEl, testAudioElement } from '../../utils'
import { AudioElement } from "../../../src/features/player/components/AudioElement";
import type { TestMockAudioEl } from '../../types';

const handleNextTrackMock = jest.fn()
const mockSrc = "mock.mp3"
const undefinedSrc = ""

let mockAudioEl: TestMockAudioEl

describe("AudioElement", () => {
  beforeEach(() => {
    mockAudioEl = createMockAudioEl({ volume: 100 })
  })

  afterEach(() => {
    mockAudioEl = null
  })

  it("properly renders html audio element", () => {
    const { container } = render(
      <AudioElement
        ref={mockAudioEl}
        src={mockSrc}
        handleNextTrack={handleNextTrackMock}
      />
    )

    testAudioElement(
      container,
      mockAudioEl,
      handleNextTrackMock,
      `http://localhost/${mockSrc}`
    )
  })

  it("properly renders html audio element before song is selected", () => {
    const { container } = render(
      <AudioElement
        ref={mockAudioEl}
        src={undefinedSrc}
        handleNextTrack={handleNextTrackMock}
      />
    )

    testAudioElement(
      container,
      mockAudioEl,
      handleNextTrackMock,
      undefinedSrc
    )
  })
})
