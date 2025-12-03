import { render } from '@testing-library/react'
import { PlayingText } from '../../../src/features/tracks/components/PlayingText'
import { CloseEditIcon } from '../../../src/features/tracks/components/CloseEditIcon'
import {
  contextRender,
  getMockSingleTrackProps,
  userRender,
  userRenderContext,
} from '../../utils'
import { MetaItem } from '../../../src/features/tracks/components/MetaItem'
import ConcertMeta from '../../../src/features/tracks/components/ConcertMeta'
import SingleTrack from '../../../src/features/tracks/components/SingleTrack'
import SongFormatSelect from '../../../src/features/tracks/components/SongFormatSelect'
import { MediaFormat } from '../../../src/app/interface'
import TrackListDisplay from '../../../src/features/tracks/TrackListDisplay'
import { singleConcert } from '@repo/mock-data/ui'

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

  it('SingleTrack renders a single track properly', async () => {
    const testTitle = 'test title'
    const testLength = '02:20'
    const isPlayingTest = 'Playing...'
    const playTrackMock = jest.fn()

    const testProps = getMockSingleTrackProps({
      playNewTrack: playTrackMock,
      isPlaying: false,
      title: testTitle,
      length: testLength,
    })

    const { user, getByText, queryByText, rerender } = userRender(
      <SingleTrack {...testProps} />
    )

    expect(getByText(testLength)).toBeVisible()
    await user.click(getByText(testTitle))
    expect(playTrackMock).toHaveBeenCalledTimes(1)

    const propsWithoutTitle = getMockSingleTrackProps({
      playNewTrack: playTrackMock,
      isPlaying: false,
    })

    rerender(<SingleTrack {...propsWithoutTitle} />)
    expect(getByText(propsWithoutTitle.name)).toBeVisible()
    expect(queryByText(testLength)).toBeNull()

    const currentlyPlayingProps = getMockSingleTrackProps({
      playNewTrack: playTrackMock,
      isPlaying: true,
    })

    rerender(<SingleTrack {...currentlyPlayingProps} />)
    expect(getByText(isPlayingTest)).toBeVisible()
  })

  it('SongFormatSelect allows you to select the song format', async () => {
    const mp3Format = MediaFormat.MP3.toLocaleUpperCase()
    const oggFormat = MediaFormat.OGG.toLocaleUpperCase()

    const { user, getByText, getByTestId } = userRenderContext(
      <SongFormatSelect />
    )

    const initialFormat = getByText(mp3Format)
    expect(initialFormat).toBeVisible()
    expect(initialFormat).toHaveStyle({ fontWeight: '400' })

    await user.click(getByTestId('EditIcon'))

    expect(getByText(mp3Format)).toHaveStyle({ fontWeight: '700' })

    const newFormat = getByText(oggFormat)
    expect(newFormat).toBeVisible()
    expect(newFormat).toHaveStyle({ fontWeight: '400' })

    await user.click(newFormat)
    expect(getByText(oggFormat)).toHaveStyle({ fontWeight: '700' })
  })

  it('TrackListDisplay renders a tracklist', () => {
    const { getByText } = contextRender(
      <TrackListDisplay
        trackList={singleConcert.trackList}
        currentTrackName={singleConcert.trackList[0].name}
        playNewTrack={jest.fn()}
      />
    )

    for (const { title } of singleConcert.trackList) {
      expect(getByText(title)).toBeVisible()
    }
  })
})
