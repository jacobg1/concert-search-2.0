import { waitFor } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import type {
  ConcertListItemMatchers,
  ConcertListItemText,
  SearchConcertMatchers,
} from '../types'

const search = 'Search'

export async function searchConcerts(
  user: UserEvent,
  { getByText, getAllByRole }: SearchConcertMatchers
) {
  const [firstInput] = getAllByRole('combobox')

  await user.click(firstInput)

  const [, firstBandOption] = getAllByRole('option')
  await user.click(firstBandOption)
  await user.click(getByText(search))
}

export async function testConcertListItem(
  user: UserEvent,
  { title, source, description }: ConcertListItemText,
  { findByText, queryByText }: ConcertListItemMatchers
) {
  await user.click(await findByText(title))

  expect(await findByText(source)).toBeVisible()
  expect(await findByText(description)).toBeVisible()

  await user.click(await findByText(title))

  await waitFor(() => expect(queryByText(source)).toBeNull())
  await waitFor(() => expect(queryByText(description)).toBeNull())
}
