import BandAndYearSelect from '../../../src/features/concertSelect/BandAndYearSelect'
import { contextRender, getInput, userRenderContext } from '../../utils'

const bandNameId = 'select-band-name'
const concertYearId = 'select-concert-year'

const bandNameSelector = `#${bandNameId}`
const concertYearSelector = `#${concertYearId}`

describe('Concert Select Feature', () => {
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
  })
})
