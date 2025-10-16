import { RefObject, useEffect } from 'react'
import { PlayerState } from '../interface'

export function useVolumeChange(
  audioEl: RefObject<HTMLAudioElement>,
  volume: number,
  playerState: PlayerState
): void {
  useEffect(() => {
    if (audioEl.current) {
      audioEl.current.volume = (volume as number) / 100
    }
  }, [volume, playerState])
}
