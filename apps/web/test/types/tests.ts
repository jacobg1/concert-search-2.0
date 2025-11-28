import { PlayerState } from '../../src/app/interface'
import type { RefObject } from 'react'
import type { RootState, AppStore } from '../../src/app/store'
import type { RenderHookOptions, RenderOptions } from '@testing-library/react'

export interface ContextRenderOptions extends RenderOptions {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export interface ContextRenderHookOptions<T = object>
  extends RenderHookOptions<T> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export interface UsePlayPauseArgs {
  url: string
  state: PlayerState
}

export interface RenderHookArgs extends UsePlayPauseArgs {
  audioEl: RefObject<HTMLMediaElement>
}

export interface RenderDurationHookArgs {
  audioEl: RenderHookArgs['audioEl']
  url: UsePlayPauseArgs['url']
}

export interface UseSongDurationArgs {
  url?: string
}

export interface CreateMockAudioElProps {
  volume?: number
  duration?: number
  currentTime?: number
  paused?: boolean
  played?: boolean
  onloadedmetadata?: jest.Mock
  ontimeupdate?: jest.Mock
  onstalled?: jest.Mock
  play?: () => Promise<void>
  pause?: () => void
}

export interface MediaMetadataArgs {
  album?: string
  artist?: string
  title?: string
}
