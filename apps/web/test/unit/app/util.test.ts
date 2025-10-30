import {
  type BandList,
  type NetworkError,
  MediaFormat,
} from '../../../src/app/interface'
import {
  addSongFormat,
  filterHTMLText,
  findNewTrack,
  findNextTrack,
  findPreviousTrack,
  findTrackIndex,
  getBandOptions,
  getYearOptions,
  handleTrackDuration,
  handleTrackProgressDuration,
  hasNetworkError,
} from '../../../src/app/util'
import type { TrackListData } from '../../../src/features'
import { defaultAppState } from '../../utils'

const undefinedBand = undefined as unknown as BandList

const mockTrackList = [
  { name: 'test one' },
  { name: 'test two' },
  { name: 'test three' },
] as unknown as TrackListData[]

const { name: firstTrackName } = mockTrackList[0]
const { name: secondTrackName } = mockTrackList[1]
const { name: lastTrackName } = mockTrackList[2]

describe('Util', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('handleTrackDuration properly formats the track duration', () => {
    const durations = [
      { test: '03:36', expected: '03:36' },
      { test: '247.56', expected: '04:07' },
      { test: '134.42', expected: '02:14' },
      { test: '0', expected: '00:00' },
    ]

    durations.forEach(({ test, expected }) => {
      expect(handleTrackDuration(test)).toBe(expected)
    })
  })

  it('handleTrackProgressDuration properly formats the track progress duration', () => {
    const durations = [
      { test: 600, expected: '10:00' },
      { test: 890, expected: '14:50' },
      { test: 250, expected: '4:10' },
      { test: 0, expected: '0:00' },
    ]

    durations.forEach(({ test, expected }) => {
      expect(handleTrackProgressDuration(test)).toBe(expected)
    })
  })

  it('filterHTMLText properly removes html from a string', () => {
    const testWord = 'Test'

    const tests = [
      `<b>${testWord}</b>`,
      `<div><p>${testWord}</p></div>`,
      `<ul><li>${testWord}</li></ul>`,
    ]

    tests.forEach((test) => {
      expect(filterHTMLText(test)).toBe(testWord)
    })

    expect(filterHTMLText()).toBe('')

    const replaceSpy = jest.spyOn(String.prototype, 'replace')

    tests.forEach((test) => {
      replaceSpy.mockImplementationOnce(() => {
        throw new Error('something failed')
      })
      expect(filterHTMLText(test)).toBe(test)
    })
  })

  it('getBandOptions properly creates select menu options', () => {
    const {
      concertSelect: { bandList },
    } = defaultAppState

    const output = getBandOptions(bandList)

    for (const [i, val] of output.entries()) {
      expect(val.label).toBe(Object.keys(bandList)[i])
    }

    expect(getBandOptions(undefinedBand).length).toBe(0)
  })

  it('getYearOptions properly creates select menu options', () => {
    const {
      concertSelect: { bandList },
    } = defaultAppState

    expect(getYearOptions(bandList).length).toBe(0)
    expect(getYearOptions(undefinedBand).length).toBe(0)

    for (const [key, val] of Object.entries(bandList)) {
      const output = getYearOptions(bandList, key)

      for (const [i, { label }] of output.entries()) {
        expect(label).toBe(val[i])
      }
    }
  })

  it('findTrackIndex finds the correct index', () => {
    const trackOne = findTrackIndex(mockTrackList, 'test one')
    const trackTwo = findTrackIndex(mockTrackList, 'test two')
    const trackThree = findTrackIndex(mockTrackList, 'test three')
    const trackFour = findTrackIndex(mockTrackList, 'test four')

    expect(trackOne).toBe(0)
    expect(trackTwo).toBe(1)
    expect(trackThree).toBe(2)
    expect(trackFour).toBe(-1)
  })

  it('findPreviousTrack works properly', () => {
    const noCurrentTrack = findPreviousTrack(mockTrackList, 0)
    const firstTrack = findPreviousTrack(mockTrackList, 0, 'test one')
    const lastTrack = findPreviousTrack(mockTrackList, 2, 'test two')

    expect(noCurrentTrack.name).toBe(firstTrackName)
    expect(firstTrack.name).toBe(lastTrackName)
    expect(lastTrack.name).toBe(secondTrackName)
  })

  it('findNextTrack works properly', () => {
    const noCurrentTrack = findNextTrack(mockTrackList, 0)
    const firstTrack = findNextTrack(mockTrackList, 0, 'test one')
    const lastTrack = findNextTrack(mockTrackList, 2, 'test two')

    expect(noCurrentTrack.name).toBe(firstTrackName)
    expect(firstTrack.name).toBe(secondTrackName)
    expect(lastTrack.name).toBe(firstTrackName)
  })

  it('findNewTrack finds the correct track', () => {
    const noCurrentTrack = findNewTrack(mockTrackList)
    const secondTrack = findNewTrack(mockTrackList, secondTrackName)

    expect(noCurrentTrack.name).toBe(firstTrackName)
    expect(secondTrack.name).toBe(secondTrackName)
  })

  it('addSongFormat adds song format as a file extension', () => {
    expect(addSongFormat('test.format', MediaFormat.MP3)).toBe('test.mp3')
    expect(addSongFormat('test.format', MediaFormat.OGG)).toBe('test.ogg')
  })

  it('hasNetworkError returns true if network error is present', () => {
    const err = { message: 'request failed' } as NetworkError

    expect(hasNetworkError({}, {})).toBe(false)

    expect(hasNetworkError(err, {})).toBe(true)
    expect(hasNetworkError({}, err)).toBe(true)
    expect(hasNetworkError(err, err)).toBe(true)
  })
})
