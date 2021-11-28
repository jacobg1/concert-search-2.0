import { useRef, useState } from 'react'
import { AudioElement } from './components/AudioElement'

export default function AudioPlayer() {
  const audioEl = useRef<HTMLAudioElement>(null)
  const [playerState, setPlayerState] = useState('play')
  const onClick = () => {
    const { current } = audioEl
    if (!current) return null

    if (current.paused) {
      setPlayerState('pause')
      current.play()
    } else {
      setPlayerState('play')
      current.pause()
    }
  }
  const playOrPause = () => {
    const { current } = audioEl
    if (!current) return 'Play'
    return current.paused ? 'Pause' : 'Play'
  }
  return (
    <>
      <p onClick={onClick}>{playerState}</p>
      <AudioElement
        // controls={false}
        ref={audioEl}
        src="https://ia600501.us.archive.org/13/items/moe2011-03-25.salvo/moe2011-03-25d2t-03.mp3"
      />
      {/* <audio
        controls={false}
        ref={(el) => (audioEl.current = el)}
        id="musicPlayer"
        preload="metadata"
        crossOrigin="anonymous"
        src="https://ia600501.us.archive.org/13/items/moe2011-03-25.salvo/moe2011-03-25d2t-03.mp3"
      /> */}
    </>
  )
}
