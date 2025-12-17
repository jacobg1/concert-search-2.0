import { screen, render } from '@testing-library/react'
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
    render(<PlayingText />)
    expect(screen.getByText('Playing...')).toBeVisible()
  })

  it('CloseEditIcon works properly', async () => {
    for (const { isOpen, iconName } of [
      { isOpen: false, iconName: 'EditIcon' },
      { isOpen: true, iconName: 'CloseIcon' },
    ]) {
      const mockOpenMenu = jest.fn()

      const { user } = userRender(
        <CloseEditIcon isOpen={isOpen} openMenu={mockOpenMenu} />
      )

      await user.click(screen.getByTestId(iconName))
      expect(mockOpenMenu).toHaveBeenCalledTimes(1)
    }
  })

  it('MetaItem properly renders label and value', () => {
    const testData = {
      label: 'test label',
      value: 'test value',
    }

    const { label, value } = testData

    render(<MetaItem {...testData} />)

    expect(screen.getByText(label)).toBeVisible()
    expect(screen.getByText(value, { exact: false })).toBeVisible()
  })

  it('ConcertMeta properly shows metadata items', async () => {
    const { user } = userRender(<ConcertMeta {...mockMetadata} />)

    const labels = [
      { label: 'Band', value: mockMetadata.creator },
      { label: 'Date', value: mockMetadata.date },
      { label: 'Venue', value: mockMetadata.venue },
      { label: 'Tracks', value: mockMetadata.numTracks },
      { label: 'Description', value: mockMetadata.description },
      { label: 'Source', value: mockMetadata.source },
    ]

    await user.click(screen.getByText(mockMetadata.title))

    for (const { label, value } of labels) {
      expect(screen.getByText(label)).toBeVisible()
      expect(screen.getByText(value, { exact: false })).toBeVisible()
    }
  })

  it('ConcertMeta does not render metaitem if value is undefined', async () => {
    const { title, source } = mockMetadata

    const { user } = userRender(
      <ConcertMeta {...mockMetadata} source={undefined} />
    )

    await user.click(screen.getByText(title))

    expect(screen.queryByText('Source')).toBeNull()
    expect(screen.queryByText(source, { exact: false })).toBeNull()
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

    const { user, rerender } = userRender(<SingleTrack {...testProps} />)

    expect(screen.getByText(testLength)).toBeVisible()
    await user.click(screen.getByText(testTitle))
    expect(playTrackMock).toHaveBeenCalledTimes(1)

    const propsWithoutTitle = getMockSingleTrackProps({
      playNewTrack: playTrackMock,
      isPlaying: false,
    })

    rerender(<SingleTrack {...propsWithoutTitle} />)
    expect(screen.getByText(propsWithoutTitle.name)).toBeVisible()
    expect(screen.queryByText(testLength)).toBeNull()

    const currentlyPlayingProps = getMockSingleTrackProps({
      playNewTrack: playTrackMock,
      isPlaying: true,
    })

    rerender(<SingleTrack {...currentlyPlayingProps} />)
    expect(screen.getByText(isPlayingTest)).toBeVisible()
  })

  it('SongFormatSelect allows you to select the song format', async () => {
    const mp3Format = MediaFormat.MP3.toLocaleUpperCase()
    const oggFormat = MediaFormat.OGG.toLocaleUpperCase()

    const { user } = userRenderContext(<SongFormatSelect />)

    const initialFormat = screen.getByText(mp3Format)
    expect(initialFormat).toBeVisible()
    expect(initialFormat).toHaveStyle({ fontWeight: '400' })

    await user.click(screen.getByTestId('EditIcon'))

    expect(screen.getByText(mp3Format)).toHaveStyle({ fontWeight: '700' })

    const newFormat = screen.getByText(oggFormat)
    expect(newFormat).toBeVisible()
    expect(newFormat).toHaveStyle({ fontWeight: '400' })

    await user.click(newFormat)
    expect(screen.getByText(oggFormat)).toHaveStyle({ fontWeight: '700' })
  })

  it('TrackListDisplay renders a tracklist', () => {
    contextRender(
      <TrackListDisplay
        trackList={singleConcert.trackList}
        currentTrackName={singleConcert.trackList[0].name}
        playNewTrack={jest.fn()}
      />
    )

    for (const { title } of singleConcert.trackList) {
      expect(screen.getByText(title)).toBeVisible()
    }
  })
})
