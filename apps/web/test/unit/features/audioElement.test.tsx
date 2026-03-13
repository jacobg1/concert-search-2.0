import { render } from '@testing-library/react'
import { createMockAudioEl, testAudioElement } from '../../utils'
import { AudioElement } from "../../../src/features/player/components/AudioElement";
import type { TestMockAudioEl } from '../../types';

const handleNextTrackMock = jest.fn()
const mockSrc = "mock.mp3"
const undefinedSrc = ""

let mockAudioElement: TestMockAudioEl

describe("AudioElement", () => {
  beforeEach(() => {
    mockAudioElement = createMockAudioEl()
  })

  afterEach(() => {
    mockAudioElement = null
  })

  it("properly renders html audio element", () => {
    const { container } = render(
      <AudioElement
        ref={mockAudioElement}
        src={mockSrc}
        handleNextTrack={handleNextTrackMock}
      />
    )

    testAudioElement(
      container,
      mockAudioElement,
      handleNextTrackMock,
      `http://localhost/${mockSrc}`
    )
  })

  it("properly renders html audio element before song is selected", () => {
    const { container } = render(
      <AudioElement
        ref={mockAudioElement}
        src={undefinedSrc}
        handleNextTrack={handleNextTrackMock}
      />
    )

    testAudioElement(
      container,
      mockAudioElement,
      handleNextTrackMock,
      undefinedSrc
    )
  })
})
