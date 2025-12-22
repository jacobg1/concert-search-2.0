import { screen } from '@testing-library/react'
import { IconDirection } from '../../../src/app/interface'
import { BackButton } from '../../../src/features/selectedConcert/components/BackButton'
import {
  contextRender,
  expectedRotation,
  userRenderContext,
} from '../../utils'

const arrowIconId = 'ArrowLeftSharpIcon'

describe('Selected Concert', () => {
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
})
