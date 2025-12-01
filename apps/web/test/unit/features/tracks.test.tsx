import { render } from '@testing-library/react'
import { PlayingText } from '../../../src/features/tracks/components/PlayingText'
import { CloseEditIcon } from '../../../src/features/tracks/components/CloseEditIcon'
import { userRender } from '../../utils'
import { MetaItem } from '../../../src/features/tracks/components/MetaItem'
import ConcertMeta from '../../../src/features/tracks/components/ConcertMeta'

const mockMetadata = {
  title: 'test title',
  source: 'test source',
  creator: 'test creator',
  date: '01/01/01',
  venue: 'test venue',
  numTracks: '6',
  description: 'test description',
}

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

  it('MetaItem properly renders label and value', () => {
    const testData = {
      label: 'test label',
      value: 'test value',
    }

    const { getByText } = render(<MetaItem {...testData} />)

    expect(getByText(testData.label)).toBeVisible()
    expect(getByText(testData.value, { exact: false })).toBeVisible()
  })

  it('ConcertMeta properly shows metadata items', async () => {
    const { user, getByText } = userRender(<ConcertMeta {...mockMetadata} />)

    const labels = [
      { label: 'Band', value: mockMetadata.creator },
      { label: 'Date', value: mockMetadata.date },
      { label: 'Venue', value: mockMetadata.venue },
      { label: 'Tracks', value: mockMetadata.numTracks },
      { label: 'Description', value: mockMetadata.description },
      { label: 'Source', value: mockMetadata.source },
    ]

    await user.click(getByText(mockMetadata.title))

    for (const { label, value } of labels) {
      expect(getByText(label)).toBeVisible()
      expect(getByText(value, { exact: false })).toBeVisible()
    }
  })

  it('ConcertMeta does not render metaitem if value is undefined', async () => {
    const { user, getByText, queryByText } = userRender(
      <ConcertMeta {...mockMetadata} source={undefined} />
    )

    await user.click(getByText(mockMetadata.title))

    expect(queryByText('Source')).toBeNull()
    expect(queryByText(mockMetadata.source, { exact: false })).toBeNull()
  })
})
