import { useEffect } from 'react'
import { PlayerState } from '../interface'

export function useVolumeChange(
  current: HTMLAudioElement | null,
  volume: number,
  playerState: PlayerState
): void {
  useEffect(() => {
    if (current) {
      current.volume = (volume as number) / 100
    }
  }, [volume, playerState])
}
