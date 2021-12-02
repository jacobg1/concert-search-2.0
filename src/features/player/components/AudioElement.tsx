import { forwardRef } from 'react'

interface AudioElementProps {
  src: string
  children?: React.ReactNode
  handleNextTrack: () => void
}

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  (props, forwardedRef) => {
    return (
      <audio
        ref={forwardedRef}
        src={props.src}
        onEnded={() => props.handleNextTrack()}
        id="musicPlayer"
        preload="metadata"
        crossOrigin="anonymous"
      />
    )
  }
)
