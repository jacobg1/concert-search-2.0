import { forwardRef } from 'react'
import { AudioElementProps } from '../playerInterface'
import { memo } from 'react'

const AudioElementComponent = forwardRef<HTMLAudioElement, AudioElementProps>(
  (props, forwardedRef) => {
    return (
      <audio
        ref={forwardedRef}
        src={props.src || undefined}
        onEnded={() => props.handleNextTrack()}
        id="musicPlayer"
        preload="auto"
        style={{ width: '100%' }}
        controlsList="nodownload noplaybackrate"
        crossOrigin="anonymous"
      />
    )
  }
)

export const AudioElement = memo(AudioElementComponent)
