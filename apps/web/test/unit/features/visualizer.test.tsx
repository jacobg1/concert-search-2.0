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

const mockAudioElement = createMockAudioEl()

describe("Visualizer feature", () => {
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

    expect(getCanvasHeight(container)).toBe(150)

    await user.click(screen.getByTestId("BarChartSharpIcon"))
    expect(getCanvasHeight(container)).toBe(0)

    await user.click(screen.getByTestId("BarChartSharpIcon"))
    expect(getCanvasHeight(container)).toBe(150)
  })
})
