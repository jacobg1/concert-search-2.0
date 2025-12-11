import BandAndYearSelect from '../../../src/features/concertSelect/BandAndYearSelect'
import ConcertSelectButton from '../../../src/features/concertSelect/components/ConcertSelectButton'
import FilterDuplicatesCheckbox from '../../../src/features/concertSelect/components/FilterDuplicatesCheckbox'
import {
  contextRender,
  getInput,
  mockConcertListPayload,
  userRenderContext,
} from '../../utils'

const bandNameId = 'select-band-name'
const concertYearId = 'select-concert-year'

const bandNameSelector = `#${bandNameId}`
const concertYearSelector = `#${concertYearId}`

const mockConcertSelectState = {
  selectedBand: 'test',
  selectedYear: '2020',
  filterDuplicates: true,
  bandList: { test: ['2020'] },
}

describe('Concert Select Feature', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('BandAndYearSelect renders properly', () => {
    const { container } = contextRender(<BandAndYearSelect />)

    const { textContent: bandTextContent } = getInput(
      container,
      bandNameSelector
    )

    expect(bandTextContent).toBe('Select a band')

    const { textContent: yearTextContent } = getInput(
      container,
      concertYearSelector
    )

    expect(yearTextContent).toBe('Select year (optional)')
  })

  it('BandAndYearSelect renders band list and corresponding years', async () => {
    const { container, user, store, getByText, getByTestId } =
      userRenderContext(<BandAndYearSelect />)

    const {
      concertSelect: { bandList },
    } = store.getState()

    if (!bandList) throw new Error('Missing band list')

    for (const [band, years] of Object.entries(bandList)) {
      await user.click(getInput(container, bandNameSelector))
      await user.click(getByText(band))
      await user.click(getInput(container, concertYearSelector))

      const [firstYear] = years

      await user.click(getByText(firstYear))

      const {
        concertSelect: { selectedBand, selectedYear },
      } = store.getState()

      expect(selectedBand).toBe(band)
      expect(selectedYear).toBe(firstYear)
      expect(getByText(selectedBand)).toBeVisible()
      expect(getByText(selectedYear)).toBeVisible()

      await user.click(getByTestId(`${bandNameId}-clear`))
    }
  }, 7000)

  it('FilterDuplicatesCheckbox checks and unchecks properly', async () => {
    const { user, store, getByText } = userRenderContext(
      <FilterDuplicatesCheckbox />
    )

    expect(store.getState().concertSelect.filterDuplicates).toBe(true)
    await user.click(getByText('Filter duplicates'))

    expect(store.getState().concertSelect.filterDuplicates).toBe(false)
    await user.click(getByText('Filter duplicates'))

    expect(store.getState().concertSelect.filterDuplicates).toBe(true)
  })

  it('ConcertSelectButton dispatches fetch concert list action', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')

    const { selectedBand, selectedYear } = mockConcertSelectState

    const { user, getByText } = userRenderContext(
      <ConcertSelectButton />,
      {
        preloadedState: {
          concertSelect: mockConcertSelectState,
        },
      }
    )

    await user.click(getByText('Search'))

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BASE_URL}/concerts`,
      mockConcertListPayload(selectedBand, selectedYear)
    )
  })
})
