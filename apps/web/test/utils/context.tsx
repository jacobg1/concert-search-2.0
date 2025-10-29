import React, { type ReactElement, type PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { setupStore } from '../../src/app/store'
import { theme } from '../../src/app/theme'
import type { ContextRenderOptions } from '../types'

export const htmlContainer = document.body.appendChild(
  document.createElement('html')
)

export function contextRender(
  elem: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...restOfOptions
  }: ContextRenderOptions = {}
) {
  function ContextProviders({ children }: PropsWithChildren): JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Provider>
    )
  }

  return {
    store,
    ...render(elem, { wrapper: ContextProviders, ...restOfOptions }),
  }
}
