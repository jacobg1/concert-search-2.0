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
  waitForOptions,
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

type GetByText = (
  id: Matcher,
  options?: SelectorMatcherOptions | undefined
) => HTMLElement

type GetAllByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined
) => HTMLElement[]

type FindByText = (
  id: Matcher,
  options?: SelectorMatcherOptions | undefined,
  waitForElementOptions?: waitForOptions | undefined
) => Promise<HTMLElement>

type QueryByText = (
  id: Matcher,
  options?: SelectorMatcherOptions | undefined
) => HTMLElement | null

interface Matchers {
  getByText: GetByText
  getAllByRole: GetAllByRole
  findByText: FindByText
  queryByText: QueryByText
}

export type SearchConcertMatchers = Pick<
  Matchers,
  'getByText' | 'getAllByRole'
>

export type ConcertListItemMatchers = Pick<
  Matchers,
  'findByText' | 'queryByText'
>

export interface ConcertListItemText {
  title: string
  description: string
  source: string
}
