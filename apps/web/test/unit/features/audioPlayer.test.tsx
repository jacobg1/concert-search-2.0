import { render, screen } from '@testing-library/react'
import { userRender, getProgressBar, userRenderContext } from '../../utils'
import { PlayerState, TrackDirection } from '../../../src/app/interface'
import PlayOrPause from '../../../src/features/player/components/PlayOrPause'
import ProgressBar from '../../../src/features/player/components/ProgressBar'
import SkipButton from '../../../src/features/player/components/SkipButton'
import VolumeSlider from '../../../src/features/player/components/VolumeSlider'

const skipButtonHandler = jest.fn()
const setSongPosition = jest.fn()

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

  it('ProgressBar is disabled if no track has been played', () => {
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

    expect(getProgressBar(container))
      .toHaveStyle({ pointerEvents: 'none' })
  })

  it("ProgressBar's slider is disabled on smaller screens", async () => {
    Object.assign(window, {
      ...window,
      innerWidth: 400,
    })

    const mockProps = {
      duration: 200,
      position: 100,
      setSongPosition,
    }

    const { user, container } = userRender(<ProgressBar {...mockProps} />)

    await user.click(getProgressBar(container))
    expect(setSongPosition).not.toHaveBeenCalled()
  })

  it("ProgressBar's slider sets the song position", async () => {
    Object.assign(window, {
      ...window,
      innerWidth: 1000,
    })

    const mockProps = {
      duration: 200,
      position: 100,
      setSongPosition,
    }

    const { user, container } = userRender(<ProgressBar {...mockProps} />)

    await user.click(getProgressBar(container))
    expect(setSongPosition).toHaveBeenCalled()
  })
})
