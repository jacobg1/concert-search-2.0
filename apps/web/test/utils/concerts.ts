import { waitFor, screen } from '@testing-library/react'
import { IconDirection } from '../../src/app/interface'
import type { UserEvent } from '@testing-library/user-event'
import type { ConcertListItemText } from '../types'

const search = 'Search'

export async function searchConcerts(user: UserEvent) {
  const [firstInput] = screen.getAllByRole('combobox')

  await user.click(firstInput)

  const [, firstBandOption] = screen.getAllByRole('option')
  await user.click(firstBandOption)
  await user.click(screen.getByText(search))
}

export async function testConcertListItem(
  user: UserEvent,
  { title, source, description }: ConcertListItemText
) {
  await user.click(await screen.findByText(title))

  expect(await screen.findByText(source)).toBeVisible()
  expect(await screen.findByText(description)).toBeVisible()

  await user.click(await screen.findByText(title))

  await waitFor(() => expect(screen.queryByText(source)).toBeNull())
  await waitFor(() => expect(screen.queryByText(description)).toBeNull())
}

export const expectedRotation = (dir: IconDirection) => {
  if (dir === IconDirection.Left) return '0'
  else return '180deg'
}
