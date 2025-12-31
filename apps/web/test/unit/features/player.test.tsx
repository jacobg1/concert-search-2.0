import { render, screen } from '@testing-library/react'
import { userRenderContext } from '../../utils'
import { PlayerState } from '../../../src/app/interface'
import PlayOrPause from '../../../src/features/player/components/PlayOrPause'
import ProgressBar from '../../../src/features/player/components/ProgressBar'

describe('Player Feature', () => {
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

  // TODO - setup mocking and mock audio file
})
