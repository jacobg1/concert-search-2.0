import { screen } from '@testing-library/react'
import { IconDirection, PlayerState } from '../../../src/app/interface'
import { BackButton } from '../../../src/features/selectedConcert/components/BackButton'
import {
  contextRender,
  defaultAppState,
  expectedRotation,
  userRenderContext,
} from '../../utils'
import SelectedConcertDisplay from '../../../src/features/selectedConcert/SelectedConcertDisplay'
import { singleConcert } from '@repo/mock-data/ui'

const arrowIconId = 'ArrowLeftSharpIcon'

let mockPlay: jest.SpyInstance<Promise<void>>

describe('Selected Concert', () => {
  beforeEach(() => {
    mockPlay = jest.spyOn(HTMLMediaElement.prototype, 'play')
  })

  afterEach(() => {
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

    const { user, store } = userRenderContext(<SelectedConcertDisplay />, {
      preloadedState: {
        individualConcert: {
          ...defaultAppState.individualConcert,
          playerState: PlayerState.Play,
          selectedConcert: singleConcert
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

    const [{ link, name }] = singleConcert.trackList

    expect(concertInitialized).toBe(true)
    expect(playUrl).toBe(link)
    expect(currentTrackName).toBe(name)
  })
})
