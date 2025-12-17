import React from 'react'
import { screen, render } from '@testing-library/react'
import App from '../../src/App'
import { AppHeader } from '../../src/AppHeader'
import { AppStyles } from '../../src/AppStyles'
import { theme } from '../../src/app/theme'
import { contextRender, htmlContainer, userRenderContext } from '../utils'
import { ErrorDisplay } from '../../src/ErrorDisplay'
import type {
  SelectedConcertState,
  ConcertListState,
} from '../../src/features'

const testTrack = { name: 'test track' }

describe('App', () => {
  it('App component renders properly', () => {
    render(<App />)
    expect(screen.getByText('Concert Search')).toBeInTheDocument()
  })

  it('Back button shows when concert has been selected', () => {
    contextRender(<AppHeader />, {
      preloadedState: {
        individualConcert: {
          selectedConcert: { trackList: [testTrack] },
        } as SelectedConcertState,
      },
    })

    expect(screen.getByTestId('ArrowLeftSharpIcon')).toBeInTheDocument()
  })

  it('App styles component sets the correct style when concert drawer is closed', () => {
    const { container } = contextRender(
      <body>
        <AppStyles theme={theme} />
      </body>,
      { container: htmlContainer }
    )

    const appBody = container.querySelector('body')
    expect(appBody).toHaveStyle({ overflow: 'auto' })
  })

  it('App styles component sets the correct style when concert drawer is open', () => {
    const { container } = contextRender(
      <body>
        <AppStyles theme={theme} />
      </body>,
      {
        container: htmlContainer,
        preloadedState: {
          individualConcert: {
            isDrawerOpen: true,
          } as SelectedConcertState,
        },
      }
    )

    const appBody = container.querySelector('body')
    expect(appBody).toHaveStyle({ overflow: 'hidden' })
  })

  it('error display works properly', async () => {
    const { user } = userRenderContext(<ErrorDisplay />, {
      preloadedState: {
        concertList: {
          error: { message: 'test error' },
        } as ConcertListState,
      },
    })

    const closeErrorButton = screen.getByTestId('close-error-button')
    expect(closeErrorButton).toBeInTheDocument()

    await user.click(screen.getByTestId('close-error-button'))
    expect(screen.queryByTestId('close-error-button')).not.toBeVisible()
  })
})
