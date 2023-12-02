import { forwardRef } from 'react'
import { AudioElementProps } from '../playerInterface'
import { useResize } from '../../../app/hooks'

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  (props, forwardedRef) => {
    const [, windowWidth] = useResize(1000)
    return (
      <audio
        ref={forwardedRef}
        src={props.src || ''}
        onEnded={() => props.handleNextTrack()}
        id="musicPlayer"
        preload="auto"
        style={{ width: '100%' }}
        controls={windowWidth <= 768 && !!props.src}
        controlsList="nodownload noplaybackrate"
        crossOrigin="anonymous"
      />
    )
  }
)
