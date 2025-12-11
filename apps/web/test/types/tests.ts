import { type IAudioContext, PlayerState } from '../../src/app/interface'
import type { RefObject } from 'react'
import type { RootState, AppStore } from '../../src/app/store'
import type {
  ByRoleMatcher,
  ByRoleOptions,
  Matcher,
  RenderHookOptions,
  RenderOptions,
  SelectorMatcherOptions,
} from '@testing-library/react'

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

interface AudioContextSpies {
  source: jest.SpyInstance
  analyser: jest.SpyInstance
}

export interface TestAudioContextArgs {
  current: IAudioContext
  unmount: () => void
  connect: AudioContextSpies
  disconnect: AudioContextSpies
}

export interface MockSingleTrackProps {
  playNewTrack: jest.Mock
  isPlaying: boolean
  title?: string
  length?: string
}

export type GetByText = (
  id: Matcher,
  options?: SelectorMatcherOptions | undefined
) => HTMLElement

export type GetAllByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined
) => HTMLElement[]
