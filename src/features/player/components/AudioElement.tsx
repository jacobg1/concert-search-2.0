import { forwardRef } from 'react'
import { AudioElementProps } from '../playerInterface'

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  (props, forwardedRef) => {
    return (
      <audio
        ref={forwardedRef}
        src={props.src}
        onEnded={() => props.handleNextTrack()}
        id="musicPlayer"
        preload="auto"
        crossOrigin="anonymous"
      />
    )
  }
)
