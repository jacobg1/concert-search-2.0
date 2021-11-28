import { forwardRef } from 'react'

interface AudioElementProps {
  src: string
  children?: React.ReactNode
}

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  (props, forwardedRef) => {
    console.log(props)
    return (
      <audio
        ref={forwardedRef}
        id="musicPlayer"
        preload="metadata"
        crossOrigin="anonymous"
        src={props.src}
      />
    )
  }
)
