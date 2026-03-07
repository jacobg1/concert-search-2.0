import { screen } from '@testing-library/react'
import {
  contextRender,
  createMockAudioEl,
  getCanvasHeight,
  TestVisualizer,
  userRenderContext
} from '../../utils'
import Visualizer from '../../../src/features/visualizer/Visualizer'
import React from 'react'


const mockRequestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame')
const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame')
const mockAudioElement = createMockAudioEl()

describe("Visualizer feature", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("Visualizer doesn't render if concert hasn't been initialized", () => {
    contextRender(<TestVisualizer Component={Visualizer} concertInitialized={false} />)
    expect(screen.queryByTestId("BarChartSharpIcon")).toBeNull()
  })

  it("Visualizer renders once concert has been initialized", () => {
    contextRender(<TestVisualizer Component={Visualizer} concertInitialized />)
    expect(screen.queryByTestId("BarChartSharpIcon")).not.toBeNull()
  })

  it("Visualizer toggles open and closed properly", async () => {
    const { user, container } = userRenderContext(
      <Visualizer audioEl={mockAudioElement} concertInitialized />
    )

    const visualizerIcon = screen.getByTestId("BarChartSharpIcon")

    expect(getCanvasHeight(container)).toBe(150)

    await user.click(visualizerIcon)
    expect(getCanvasHeight(container)).toBe(0)

    await user.click(visualizerIcon)
    expect(getCanvasHeight(container)).toBe(150)
  })

  it("Pausing visualizer does nothing if animation hasn't yet been played", async () => {
    mockRequestAnimationFrame.mockReturnValue(0)

    const { user } = userRenderContext(
      <Visualizer audioEl={mockAudioElement} concertInitialized />
    )

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(0)

    await user.click(screen.getByTestId("BarChartSharpIcon"))

    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1)
  })

  it("Pausing visualizer cancels animation frame", async () => {
    mockRequestAnimationFrame.mockReturnValue(7)

    const { user } = userRenderContext(
      <Visualizer audioEl={mockAudioElement} concertInitialized />
    )

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(0)

    await user.click(screen.getByTestId("BarChartSharpIcon"))

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(7)
    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(2)
  })
})
