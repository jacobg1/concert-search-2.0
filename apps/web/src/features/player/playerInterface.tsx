import {
  AudioRef,
  PlayerState,
  PopoverHandler,
  SongPositionHandler,
  TrackDirection,
  VolumeChangeHandler,
} from '../../app/interface'

export interface AudioPlayerProps {
  handleNextTrack: () => void
  handlePreviousTrack: () => void
  setSongPosition: SongPositionHandler
  position: number
  playerState: PlayerState
  playUrl: string
  audioEl: AudioRef
}

export interface AudioElementProps {
  src: string
  children?: React.ReactNode
  handleNextTrack: () => void
}

export interface PlayOrPauseProps {
  isPlaying: boolean
  onPlayPauseClick: () => void
}

export interface ProgressBarProps {
  duration: number
  position: number
  setSongPosition: SongPositionHandler
}

export interface DurationLabelProps {
  time: string
  disabled: boolean
  prefix?: '-'
}

export interface NextOrPreviousTrackProps {
  clickHandler: () => void
  direction: TrackDirection
}

export interface VolumeSliderProps {
  volume: number
  handleVolumeChange: VolumeChangeHandler
}

export interface VolumeButtonProps {
  toggle: boolean
  forMobile?: boolean
  clickHandler: PopoverHandler<HTMLButtonElement>
}
