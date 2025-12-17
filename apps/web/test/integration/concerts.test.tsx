import { concertList } from '@repo/mock-data/ui'
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

    const { user, getByText, getAllByRole, getByTestId } = userRender(
      <App />
    )

    await searchConcerts(user, { getByText, getAllByRole })

    const [firstPage, secondPage] = concertList

    for (const concert of firstPage) {
      expect(getByText(concert.title)).toBeVisible()
    }

    await user.click(getByTestId(nextPageIcon))

    for (const concert of secondPage) {
      expect(getByText(concert.title)).toBeVisible()
    }
  })

  it('Concert list shows an error message if fetching concert list fails', async () => {
    mockFetch(fetchMock, mockError, false)

    const { user, findByTestId, getAllByRole, getByText } = userRender(
      <App />
    )

    await searchConcerts(user, { getByText, getAllByRole })
    await closeErrorModal(user, false, { findByTestId })
  })

  it('Can retry search if initial search fails', async () => {
    mockFetch(fetchMock, mockError, false)

    const { user, findByTestId, getAllByRole, getByText } = userRender(
      <App />
    )

    await searchConcerts(user, { getByText, getAllByRole })
    await closeErrorModal(user, true, { findByTestId })

    mockFetch(fetchMock, concertList, true)

    await searchConcerts(user, { getByText, getAllByRole })

    const [firstPage] = concertList[0]

    expect(getByText(firstPage.title)).toBeVisible()
  })
})
