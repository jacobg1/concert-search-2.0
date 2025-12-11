import type { UserEvent } from '@testing-library/user-event'
import type { GetAllByRole, GetByText } from '../types'

const search = 'Search'

export async function searchConcerts(
  user: UserEvent,
  getByText: GetByText,
  getAllByRole: GetAllByRole
) {
  const [firstInput] = getAllByRole('combobox')

  await user.click(firstInput)

  const [, firstBandOption] = getAllByRole('option')
  await user.click(firstBandOption)
  await user.click(getByText(search))
}
