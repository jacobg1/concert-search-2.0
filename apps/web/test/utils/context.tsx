import React, {
  type ReactElement,
  type PropsWithChildren,
  type RefObject,
  useRef,
} from 'react'
import { render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { type AppStore, setupStore } from '../../src/app/store'
import { theme } from '../../src/app/theme'
import type {
  ContextRenderOptions,
  ContextRenderHookOptions,
  TestVisualizerProps,
} from '../types'

export const htmlContainer = document.body.appendChild(
  document.createElement('html')
)

function MakeWrapper(store: AppStore) {
  return function ContextProviders({
    children,
  }: PropsWithChildren): JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Provider>
    )
  }
}

export function contextRender(
  elem: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...restOfOptions
  }: ContextRenderOptions = {}
) {
  return {
    store,
    ...render(elem, { wrapper: MakeWrapper(store), ...restOfOptions }),
  }
}

export function contextRenderHook<Result, Args>(
  hook: (args: Args) => Result,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...restOfOptions
  }: ContextRenderHookOptions<Args> = {}
) {
  return {
    store,
    ...renderHook<Result, Args>(hook, {
      wrapper: MakeWrapper(store),
      ...restOfOptions,
    }),
  }
}

export function userRender(
  elem: ReactElement,
  opts: ContextRenderOptions = {}
) {
  const user = userEvent.setup()
  return { user, ...render(elem, opts) }
}

export function userRenderContext(
  elem: ReactElement,
  opts: ContextRenderOptions = {}
) {
  const user = userEvent.setup()
  return { user, ...contextRender(elem, opts) }
}

export function TestVisualizer({
  Component,
  concertInitialized,
}: TestVisualizerProps): JSX.Element | null {
  const audioRef = useRef<HTMLAudioElement>(null)
  return (
    <Component
      audioEl={audioRef}
      concertInitialized={concertInitialized}
    />
  )
}
