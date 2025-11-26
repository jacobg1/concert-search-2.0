import { PlayerState } from '../../src/app/interface'
import type { RootState, AppStore } from '../../src/app/store'
import type { RenderOptions } from '@testing-library/react'

export interface ContextRenderOptions extends RenderOptions {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export interface UsePlayPauseArgs {
  url: string
  state: PlayerState
}

export interface UseSongDurationArgs {
  url?: string
}
