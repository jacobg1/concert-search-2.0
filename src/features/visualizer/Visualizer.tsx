import { useEffect, useRef, memo, useState } from 'react'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import { Box } from '@mui/material'
import {
  useMediaHandlers,
  useAudioContext,
  useResize,
  useAppSelector,
} from '../../app/hooks'
import { PlayerState } from '../../app/interface'
import { VisualizerPaused } from './VisualizerPaused'

interface VisualizerProps {
  current: HTMLAudioElement
}

function Visualizer({ current }: VisualizerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const [, windowWidth] = useResize(1000)
  const [isVizPaused, setIsVizPaused] = useState<boolean | null>(null)

  const [dataArray, audioBufferLength, analyser] = useAudioContext(current)

  const { playerState } = useAppSelector((state) => state.individualConcert)

  useMediaHandlers(current)

  const isSoundPlaying = playerState === PlayerState.Play

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

  // Handle visualizer toggle
  useEffect(() => {
    if (!animationRef.current) return
    if (!isVizPaused) {
      cancelAnimationFrame(animationRef.current)
    } else {
      animationRef.current = requestAnimationFrame(visualize)
    }
    visualize()
    return () => cancelAnimationFrame(animationRef.current)
  }, [isVizPaused, analyser])

  // Initial start of visualizer
  useEffect(() => {
    if (isSoundPlaying) visualize()
  }, [analyser, isSoundPlaying])

  return (
    <>
      <Box style={{ width: '90%', textAlign: 'right' }}>
        <BarChartSharpIcon
          fontSize="large"
          style={{ color: 'white', cursor: 'pointer' }}
          onClick={() => setIsVizPaused(!isVizPaused)}
        />
      </Box>
      {isSoundPlaying ? (
        <canvas
          ref={canvasRef}
          width={windowWidth * 0.9}
          height={isVizPaused ? '0' : '150'}
        >
          Audio Visualizer
        </canvas>
      ) : (
        !isVizPaused && <VisualizerPaused />
      )}
    </>
  )
}

export default memo(Visualizer)
