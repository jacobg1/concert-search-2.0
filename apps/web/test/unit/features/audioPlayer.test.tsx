import { render, screen } from '@testing-library/react'
import { userRender, userRenderContext } from '../../utils'
import { PlayerState, TrackDirection } from '../../../src/app/interface'
import PlayOrPause from '../../../src/features/player/components/PlayOrPause'
import ProgressBar from '../../../src/features/player/components/ProgressBar'
import SkipButton from '../../../src/features/player/components/SkipButton'
import VolumeSlider from '../../../src/features/player/components/VolumeSlider'

const skipButtonHandler = jest.fn()

describe('Audio Player Feature', () => {
  it('PlayOrPause properly toggles play or pause', async () => {
    const playPauseMock = jest.fn()

    const { user, rerender } = userRenderContext(
      <PlayOrPause isPlaying={false} onPlayPauseClick={playPauseMock} />
    )

    await user.click(screen.getByLabelText(PlayerState.Play))
    expect(playPauseMock).toHaveBeenCalledTimes(1)

    rerender(
      <PlayOrPause isPlaying={true} onPlayPauseClick={playPauseMock} />
    )

    await user.click(screen.getByLabelText(PlayerState.Pause))
    expect(playPauseMock).toHaveBeenCalledTimes(2)
  })

  it('ProgressBar is disabled if no track has been played', () => {
    const setSongPosition = jest.fn()

    const mockProps = {
      duration: 0,
      position: 0,
      setSongPosition,
    }

    const { container } = render(<ProgressBar {...mockProps} />)

    const labels = screen.getAllByText('0:00')

    for (const label of labels) {
      expect(label).toHaveStyle({ opacity: 0.7 })
    }

    const progressBar = container.querySelector('#progressBar')

    if (!progressBar) {
      throw new Error('Failed to select progress bar')
    }

    expect(progressBar).toHaveStyle({ pointerEvents: 'none' })
  })

  it('SkipButton displays properly', () => {
    for (const dir of Object.values(TrackDirection)) {
      render(
        <SkipButton clickHandler={skipButtonHandler} direction={dir} />
      )

      expect(screen.getByLabelText(`${dir}-track`)).toBeVisible()
    }
  })

  it('SkipButton click handler works properly', async () => {
    let calls = 1

    for (const dir of Object.values(TrackDirection)) {
      const { user } = userRender(
        <SkipButton clickHandler={skipButtonHandler} direction={dir} />
      )

      await user.click(screen.getByLabelText(`${dir}-track`))
      expect(skipButtonHandler).toHaveBeenCalledTimes(calls++)
    }
  })

  it('VolumeSlider pops up and closes on click', async () => {
    const volumeChangeMock = jest.fn()

    const sliderId = 'volume-slider'
    const volumeUpIcon = 'VolumeUpIcon'
    const volumeCloseIcon = 'CloseSharpIcon'

    const { user } = userRender(
      <VolumeSlider volume={80} handleVolumeChange={volumeChangeMock} />
    )

    await user.click(screen.getByTestId(volumeUpIcon))
    expect(screen.getByTestId(sliderId)).toBeVisible()

    await user.click(screen.getByTestId(volumeCloseIcon))
    expect(screen.queryByTestId(sliderId)).toBeNull()
  })

  // TODO - setup mocking and mock audio file
})
