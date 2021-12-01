import { Box, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
// import { TrackListData } from '../tracks/trackInterface'
import { AudioElement } from './components/AudioElement'
import PlayOrPause from './components/PlayOrPause'
import VolumeSlider from './components/VolumeSlider'
import { background } from '../../app/background'
import { SxProps } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setPlayerState } from '../selectedConcert/selectedConcertSlice'

const audioPlayerStyles: SxProps = {
  padding: 2,
  width: '90%',
  border: '2px solid black',
  background,
  boxSizing: 'border-box',
}

export default function AudioPlayer({ src }: { src: string }) {
  const dispatch = useAppDispatch()
  const audioEl = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState<number>(25)

  const {
    playerState,
    currentlyPlayingTrack: { playUrl },
  } = useAppSelector((state) => state.individualConcert)

  const isPlaying = (current: HTMLAudioElement) => {
    return !!(
      current.currentTime > 0 &&
      !current.paused &&
      !current.ended &&
      current.readyState > 2
    )
  }

  useEffect(() => {
    const { current } = audioEl
    if (!current) return

    // Play when enough of track is loaded
    current.oncanplay = () => current.play()

    // Set initial volume
    current.volume = (volume as number) / 100

    // If playerState changes, play or pause accordingly
    if (playerState === 'play' && current.readyState > 2) {
      current.play()
    } else {
      current.pause()
    }
  }, [playerState, playUrl])

  const onPlayPauseClick = () => {
    const { current } = audioEl
    if (!current) return

    // Toggle playerState
    if (!isPlaying(current)) dispatch(setPlayerState('play'))
    else dispatch(setPlayerState('pause'))
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const { current } = audioEl
    if (!current) return

    current.volume = (newValue as number) / 100
    setVolume(newValue as number)
  }

  return (
    <Box my={3} sx={audioPlayerStyles}>
      <AudioElement ref={audioEl} src={src} />
      <Stack flexDirection="row" justifyContent="space-between">
        <PlayOrPause
          isPlaying={playerState === 'play'}
          onPlayPauseClick={onPlayPauseClick}
        />
        {/* next / prev track */}
        <VolumeSlider volume={volume} handleVolumeChange={handleVolumeChange} />
      </Stack>
    </Box>
  )
}
