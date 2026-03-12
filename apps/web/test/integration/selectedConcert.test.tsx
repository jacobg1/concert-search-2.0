import { screen } from '@testing-library/react'
import { concertList, singleConcert } from '@repo/mock-data/ui'
import {
  formatTrackList,
  mockFetch,
  searchConcerts,
  testPlayingTrack,
  userRender,
} from '../utils'
import App from '../../src/App'

let fetchMock: jest.SpyInstance
let mockPlay: jest.SpyInstance<Promise<void>>
let mockPause: jest.SpyInstance<void>

const errorText = "Oops! Something went wrong, please update search and try again."

const formattedConcert = formatTrackList(singleConcert)

describe('Selected Concert Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()

    fetchMock = jest.spyOn(global, 'fetch')
    mockPause = jest.spyOn(HTMLMediaElement.prototype, 'pause')
    mockPlay = jest.spyOn(HTMLMediaElement.prototype, 'play')
  })

  it('Can find and view a concert', async () => {
    mockPause.mockReturnValue()
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, formattedConcert, true)

    const { user } = userRender(<App />)

    await searchConcerts(user)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [firstConcert] = screen.getAllByText('Play')

    await user.click(firstConcert)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    formattedConcert.trackList.forEach(({ title }) => {
      expect(screen.getByText(title))
    })
  })

  it('Can find and view a concert', async () => {
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, formattedConcert, true)

    mockPause.mockReturnValue()
    mockPlay.mockResolvedValue()

    const { user } = userRender(<App />)

    await searchConcerts(user)
    const [firstConcert] = screen.getAllByText('Play')
    await user.click(firstConcert)
   
    formattedConcert.trackList.forEach(({ title }) => {
      expect(screen.getByText(title))
    })
  })

  it('Play, Pause, Next and Prev track work properly', async () => {
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, formattedConcert, true)

    mockPause.mockReturnValue()
    mockPlay.mockResolvedValue()

    const { user } = userRender(<App />)

    await searchConcerts(user)
    const [firstConcert] = screen.getAllByText('Play')

    await user.click(firstConcert)
    const [firstTrack, secondTrack] = formattedConcert.trackList

    await user.click(screen.getByText(firstTrack.title))

    await user.click(screen.getByTestId("PauseSharpIcon"))
    testPlayingTrack(firstTrack.title)

    await user.click(screen.getByLabelText("next-track"))
    testPlayingTrack(secondTrack.title)

    await user.click(screen.getByLabelText("prev-track"))
    testPlayingTrack(firstTrack.title)
  })

  it("Error text shows if single concert search fails", async () => {
    mockFetch(fetchMock, concertList, true)
    mockFetch(fetchMock, formattedConcert, false)

    mockPause.mockReturnValue()
    mockPlay.mockResolvedValue()

    const { user } = userRender(<App />)

    await searchConcerts(user)
    const [firstConcert] = screen.getAllByText('Play')

    await user.click(firstConcert)
    expect(screen.getByText(errorText)).toBeVisible()

    await user.click(screen.getByTestId('close-error-button'))
    expect(await screen.findByText(errorText)).not.toBeVisible()
  })
})
