import { screen } from '@testing-library/react'
import { concertList, singleConcert } from '@repo/mock-data/ui'
import { mockFetch, searchConcerts, userRender } from '../utils'
import App from '../../src/App'

let fetchMock: jest.SpyInstance
let mockPause: jest.SpyInstance<void>

const errorText = "Oops! Something went wrong, please update search and try again."

describe('Selected Concert Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()

    fetchMock = jest.spyOn(global, 'fetch')
    mockPause = jest.spyOn(HTMLMediaElement.prototype, 'pause')
  })

  it('Can find and view a concert', async () => {
    mockPause.mockReturnValue()
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, singleConcert, true)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [firstConcert] = screen.getAllByText('Play')

    await user.click(firstConcert)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    singleConcert.trackList.forEach(({ title }) => {
      expect(screen.getByText(title))
    })
  })

   it('Can find and view a concert', async () => {
    mockPause.mockReturnValue()
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, singleConcert, true)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    const [firstConcert] = screen.getAllByText('Play')
    await user.click(firstConcert)

    singleConcert.trackList.forEach(({ title }) => {
      expect(screen.getByText(title))
    })
  })

  it("Error text shows if single concert search fails", async () => {
    mockPause.mockReturnValue()
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, singleConcert, false)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    const [firstConcert] = screen.getAllByText('Play')
    await user.click(firstConcert)

    expect(screen.getByText(errorText)).toBeVisible()

    await user.click(screen.getByTestId('close-error-button'))
    expect(await screen.findByText(errorText)).not.toBeVisible()
  })
})
