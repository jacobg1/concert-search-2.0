import type { RootState, AppStore } from '../../src/app/store'
import type { RenderOptions } from '@testing-library/react'

export interface ContextRenderOptions extends RenderOptions {
  preloadedState?: Partial<RootState>
  store?: AppStore
}
