import { forwardRef } from 'react'

interface AudioElementProps {
  src: string
  children?: React.ReactNode
}

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  (props, forwardedRef) => {
    return (
      <audio
        ref={forwardedRef}
        src={props.src}
        id="musicPlayer"
        preload="metadata"
        crossOrigin="anonymous"
      />
    )
  }
)
