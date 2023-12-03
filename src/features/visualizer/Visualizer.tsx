import { useEffect, useRef, memo, useState, RefObject } from 'react'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import { Box } from '@mui/material'
import { useMediaHandlers, useAudioContext, useResize } from '../../app/hooks'

interface VisualizerProps {
  audioEl: RefObject<HTMLAudioElement>
}

function Visualizer({ audioEl }: VisualizerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const [, windowWidth] = useResize(1000)
  const [isPaused, setIsPaused] = useState<boolean | null>(null)

  const [dataArray, audioBufferLength, analyser] = useAudioContext(audioEl)

  useMediaHandlers(audioEl)

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

  const handleSetPaused = () => {
    if (!animationRef.current) return
    if (!isPaused) {
      setIsPaused(true)
      cancelAnimationFrame(animationRef.current)
    }
    if (isPaused === true) {
      setIsPaused(false)
      animationRef.current = requestAnimationFrame(visualize)
    }
  }

  useEffect(() => {
    visualize()
    return () => cancelAnimationFrame(animationRef.current)
  }, [analyser])

  return (
    <>
      <Box style={{ width: '90%', textAlign: 'right' }}>
        <BarChartSharpIcon
          fontSize="large"
          style={{ color: 'white', cursor: 'pointer' }}
          onClick={() => handleSetPaused()}
        />
      </Box>

      <canvas
        ref={canvasRef}
        width={windowWidth * 0.9}
        height={isPaused ? '0' : '150'}
      >
        Audio Visualizer
      </canvas>
    </>
  )
}

export default memo(Visualizer)
