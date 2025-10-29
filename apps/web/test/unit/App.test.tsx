import React from 'react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'
import { AppHeader } from '../../src/AppHeader'
import { defaultAppState } from '../utils/mocks'
import { AppStyles } from '../../src/AppStyles'
import { theme } from '../../src/app/theme'
import { contextRender, htmlContainer } from '../utils'
import { ErrorDisplay } from '../../src/ErrorDisplay'
import type {
  TrackListData,
  TrackMetadata,
} from '../../src/features/tracks/trackInterface'
import { NetworkError } from '../../src/app/interface'

const testTrack = { name: 'test track' }

describe('App', () => {
  it('App component renders properly', () => {
    const { getByText } = contextRender(<App />)
    expect(getByText('Concert Search')).toBeInTheDocument()
  })

  it('Back button shows when concert has been selected', async () => {
    const { getByTestId } = contextRender(<AppHeader />, {
      preloadedState: {
        ...defaultAppState,
        individualConcert: {
          ...defaultAppState.individualConcert,
          selectedConcert: {
            trackList: [testTrack as TrackListData],
            metadata: {} as TrackMetadata,
          },
        },
      },
    })

    expect(getByTestId('ArrowLeftSharpIcon')).toBeInTheDocument()
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
          ...defaultAppState,
          individualConcert: {
            ...defaultAppState.individualConcert,
            isDrawerOpen: true,
          },
        },
      }
    )

    const appBody = container.querySelector('body')
    expect(appBody).toHaveStyle({ overflow: 'hidden' })
  })

  it('error display works properly', async () => {
    const user = userEvent.setup()

    const { getByTestId, queryByTestId } = contextRender(<ErrorDisplay />, {
      preloadedState: {
        ...defaultAppState,
        concertList: {
          ...defaultAppState.concertList,
          error: { message: 'test error' } as NetworkError,
        },
      },
    })

    const closeErrorButton = getByTestId('close-error-button')
    expect(closeErrorButton).toBeInTheDocument()

    await user.click(getByTestId('close-error-button'))

    expect(queryByTestId('close-error-button')).not.toBeVisible()
  })
})
