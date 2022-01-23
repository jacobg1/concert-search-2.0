import { RefObject, useEffect, useRef } from 'react'
import { useAudioContext } from '../../app/hooks'

export default function Visualizer({
  audioEl,
}: {
  audioEl: RefObject<HTMLAudioElement | null>
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const [dataArray, audioBufferLength, analyser] = useAudioContext(
    audioEl.current
  )

  const visualize = () => {
    if (canvasRef.current && analyser) {
      // Start animation
      animationRef.current = requestAnimationFrame(visualize)

      // Copy frequency data to array
      analyser.getByteFrequencyData(dataArray)

      const context = canvasRef.current.getContext('2d')
      if (context) {
        const { height, width } = context.canvas

        // Set initial canvas size / color
        context.fillStyle = '#2e7e89'
        context.fillRect(0, 0, width, height)

        const animWidth = (width / audioBufferLength) * 2.5
        let animHeight
        let x = 0

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
      <canvas ref={canvasRef} width="500" height="150">
        Audio Visualizer
      </canvas>
    </>
  )
}
