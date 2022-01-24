import { useEffect, useRef, memo } from 'react'
import { useResize } from '../../app/hooks'

interface VisualizerProps {
  dataArray: Uint8Array
  audioBufferLength: number
  analyser?: AnalyserNode
}

function Visualizer({
  dataArray,
  audioBufferLength,
  analyser,
}: VisualizerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const [, windowWidth] = useResize(1000)

  const visualize = () => {
    if (canvasRef.current && analyser) {
      // Start animation
      animationRef.current = requestAnimationFrame(visualize)
      // Copy frequency data to array
      analyser.getByteFrequencyData(dataArray)

      const context = canvasRef.current.getContext('2d')
      if (context) {
        const { height, width } = context.canvas

        context.fillStyle = '#2e7e89'
        context.fillRect(0, 0, width, height)

        const animWidth = (width / audioBufferLength) * 2.5
        let animHeight
        let x = 0

        // Loop through frequency data and draw on canvas
        for (let i = 0; i < audioBufferLength; i++) {
          animHeight = dataArray[i] / 1.5
          context.fillStyle = `hsl(${i + 195}deg, 100%, 50%)`
          context.fillRect(x, height - animHeight, animWidth * 0.95, animHeight)
          x += animWidth + 1
        }
      }
    }
  }

  useEffect(() => {
    visualize()
    return () => cancelAnimationFrame(animationRef.current)
  }, [analyser])

  return (
    <>
      <canvas ref={canvasRef} width={windowWidth * 0.9} height="150">
        Audio Visualizer
      </canvas>
    </>
  )
}

export default memo(Visualizer)
