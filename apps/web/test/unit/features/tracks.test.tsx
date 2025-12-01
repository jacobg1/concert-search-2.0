import { render } from '@testing-library/react'
import { PlayingText } from '../../../src/features/tracks/components/PlayingText'
import { CloseEditIcon } from '../../../src/features/tracks/components/CloseEditIcon'
import { userRender } from '../../utils'

describe('Tracks Feature', () => {
  it('PlayingText properly renders text', () => {
    const { getByText } = render(<PlayingText />)
    expect(getByText('Playing...')).toBeVisible()
  })

  it('CloseEditIcon works properly', async () => {
    for (const { isOpen, iconName } of [
      { isOpen: false, iconName: 'EditIcon' },
      { isOpen: true, iconName: 'CloseIcon' },
    ]) {
      const mockOpenMenu = jest.fn()

      const { getByTestId, user, unmount } = userRender(
        <CloseEditIcon isOpen={isOpen} openMenu={mockOpenMenu} />
      )

      await user.click(getByTestId(iconName))
      expect(mockOpenMenu).toHaveBeenCalledTimes(1)
      unmount()
    }
  })
})
