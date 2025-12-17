import { concertList } from '@repo/mock-data/ui'
import { screen } from '@testing-library/react'
import App from '../../src/App'
import {
  closeErrorModal,
  mockFetch,
  searchConcerts,
  userRender,
} from '../utils'

const nextPageIcon = 'NavigateNextIcon'

const mockError = {
  statusCode: 500,
  message: 'request failed',
  error: 'request failed',
}

let fetchMock: jest.SpyInstance

describe('Concert List Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    fetchMock = jest.spyOn(global, 'fetch')
  })

  it('Concert list renders a list of concerts', async () => {
    mockFetch(fetchMock, concertList, true)

    const { user } = userRender(<App />)

    await searchConcerts(user)

    const [firstPage, secondPage] = concertList

    for (const concert of firstPage) {
      expect(screen.getByText(concert.title)).toBeVisible()
    }

    await user.click(screen.getByTestId(nextPageIcon))

    for (const concert of secondPage) {
      expect(screen.getByText(concert.title)).toBeVisible()
    }
  })

  it('Concert list shows an error message if fetching concert list fails', async () => {
    mockFetch(fetchMock, mockError, false)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    await closeErrorModal(user, false)
  })

  it('Can retry search if initial search fails', async () => {
    mockFetch(fetchMock, mockError, false)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    await closeErrorModal(user, true)

    mockFetch(fetchMock, concertList, true)

    await searchConcerts(user)

    const [firstPage] = concertList[0]

    expect(screen.getByText(firstPage.title)).toBeVisible()
  })
})
