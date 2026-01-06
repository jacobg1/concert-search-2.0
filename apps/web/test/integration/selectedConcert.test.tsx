import { screen } from '@testing-library/react'
import { concertList } from '@repo/mock-data/ui'
import { mockFetch, searchConcerts, userRender } from '../utils'
import App from '../../src/App'

let fetchMock: jest.SpyInstance

describe('Selected Concert Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    fetchMock = jest.spyOn(global, 'fetch')
  })

  it('Can find a concert and play a track', async () => {
    mockFetch(fetchMock, concertList, true)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [firstConcert] = screen.getAllByText('Play')

    await user.click(firstConcert)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // TODO add mocking and finish tests
  })
})
