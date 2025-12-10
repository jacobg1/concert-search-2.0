import { userRenderContext } from '../utils'
import App from '../../src/App'
import { concertList } from '@repo/mock-data/ui'

describe('Concert List Integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('Concert list renders correctly', async () => {
    // TODO - better mocking
    const fetchMock = jest.spyOn(global, 'fetch')

    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(concertList),
    } as Response)

    const { user, findByText, getAllByRole, getByText } =
      userRenderContext(<App />)

    const [firstInput] = getAllByRole('combobox')

    await user.click(firstInput)

    const [, firstBandOption] = getAllByRole('option')

    await user.click(firstBandOption)
    await user.click(getByText('Search'))

    const [{ title }] = concertList[0]

    expect(await findByText(title)).toBeVisible()
  })
})
