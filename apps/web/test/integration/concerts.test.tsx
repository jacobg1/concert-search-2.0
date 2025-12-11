import { mockFetch, searchConcerts, userRender } from '../utils'
import App from '../../src/App'
import { concertList } from '@repo/mock-data/ui'

const errorCloseButton = 'close-error-button'
const errorIconId = 'ErrorOutlineSharpIcon'
const nextPageIcon = 'NavigateNextIcon'

describe('Concert List Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('Concert list renders a list of concerts', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')

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
    const fetchMock = jest.spyOn(global, 'fetch')

    const mockError = {
      statusCode: 500,
      message: 'request failed',
      error: 'request failed',
    }

    mockFetch(fetchMock, mockError, false)

    const { user, findByTestId, getAllByRole, getByText } = userRender(
      <App />
    )

    await searchConcerts(user, { getByText, getAllByRole })

    expect(await findByTestId(errorIconId)).toBeVisible()

    await user.click(await findByTestId(errorCloseButton))

    expect(await findByTestId(errorIconId)).not.toBeVisible()
  })
})
