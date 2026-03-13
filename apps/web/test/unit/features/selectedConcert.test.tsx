import { screen } from '@testing-library/react'
import { useSongPosition } from '../../../src/app/hooks'
import { IconDirection, PlayerState } from '../../../src/app/interface'
import { BackButton } from '../../../src/features/selectedConcert/components/BackButton'
import SelectedConcertDisplay from '../../../src/features/selectedConcert/SelectedConcertDisplay'
import {
  contextRender,
  defaultAppState,
  expectedRotation,
  formattedTrackList,
  getMockSongPosition,
  userRenderContext,
} from '../../utils'

jest.mock('../../../src/app/hooks', () => {
  return {
    ...jest.requireActual('../../../src/app/hooks'),
    useSongPosition: jest.fn()
  }
})

const useSongPositionMock = useSongPosition as jest.Mock

const arrowIconId = 'ArrowLeftSharpIcon'

let mockPlay: jest.SpyInstance<Promise<void>>
let mockPause: jest.SpyInstance<void>

describe('Selected Concert Feature', () => {
  beforeEach(() => {
    mockPlay = jest.spyOn(HTMLMediaElement.prototype, 'play')
    mockPause = jest.spyOn(HTMLMediaElement.prototype, 'pause')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('BackButton properly renders left and right arrow based on direction', () => {
    for (const dir of Object.values(IconDirection)) {
      const rotation = expectedRotation(dir)

      const { unmount } = contextRender(<BackButton iconDirection={dir} />)

      expect(screen.getByTestId(arrowIconId)).toHaveStyle({
        transform: `rotate(${rotation})`,
      })

      unmount()
    }
  })

  it('BackButton properly toggles concert drawer', async () => {
    const { user, store } = userRenderContext(
      <BackButton iconDirection={IconDirection.Left} />
    )

    const {
      individualConcert: { isDrawerOpen: drawerClosed },
    } = store.getState()

    expect(drawerClosed).toBe(false)

    await user.click(screen.getByTestId(arrowIconId))

    const {
      individualConcert: { isDrawerOpen: drawerOpen },
    } = store.getState()

    expect(drawerOpen).toBe(true)
  })

  it("SelectedConcertDisplay - if no track is selected, clicking play starts the first track", async () => {
    mockPlay.mockResolvedValue()
    useSongPositionMock.mockReturnValue(getMockSongPosition())

    const { user, store } = userRenderContext(<SelectedConcertDisplay />, {
      preloadedState: {
        individualConcert: {
          ...defaultAppState.individualConcert,
          playerState: PlayerState.Play,
          selectedConcert: formattedTrackList
        }
      }
    })

    await user.click(screen.getByTestId("PauseSharpIcon"))

    const {
      individualConcert: {
        concertInitialized,
        currentlyPlayingTrack: { playUrl, currentTrackName }
      }
    } = store.getState()

    const [{ link, name }] = formattedTrackList.trackList

    expect(concertInitialized).toBe(true)
    expect(playUrl).toBe(link)
    expect(currentTrackName).toBe(name)
  })

  it("SelectedConcertDisplay connection error displays and closes properly", async () => {
    const testError = "test error"
    const mockSetConnectionError = jest.fn()

    useSongPositionMock.mockReturnValue(
      getMockSongPosition({
        connectionError: testError,
        setConnectionError: mockSetConnectionError
      })
    )

    mockPause.mockReturnValue()

    const { user, container } = userRenderContext(<SelectedConcertDisplay />, {
      preloadedState: {
        individualConcert: {
          ...defaultAppState.individualConcert,
          selectedConcert: formattedTrackList
        }
      }
    })

    expect(screen.getByText(testError)).toBeDefined()

    await user.click(screen.getByTestId("CloseIcon"))
    expect(mockSetConnectionError).toHaveBeenCalledTimes(1)

    const musicPlayer = container.querySelector("#musicPlayer")
    if (!musicPlayer) throw new Error("Missing HTML music player")

    await user.click(musicPlayer)
    expect(mockSetConnectionError).toHaveBeenCalledTimes(2)
  })
})
