import { screen } from '@testing-library/react'
import { concertList, singleConcert } from '@repo/mock-data/ui'
import { mockFetch, searchConcerts, userRender } from '../utils'
import App from '../../src/App'

let fetchMock: jest.SpyInstance
let mockPlay: jest.SpyInstance<Promise<void>>
let mockPause: jest.SpyInstance<void>

describe('Selected Concert Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()

    fetchMock = jest.spyOn(global, 'fetch')
    mockPlay = jest.spyOn(HTMLMediaElement.prototype, 'play')
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
})
