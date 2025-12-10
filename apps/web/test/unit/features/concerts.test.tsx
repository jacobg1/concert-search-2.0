import { render, waitFor } from '@testing-library/react'
import {
  contextRender,
  defaultAppState,
  userRender,
  userRenderContext,
} from '../../utils'
import { RecordIcon } from '../../../src/features/concerts/components/RecordIcon'
import PlayConcertButton from '../../../src/features/concerts/components/PlayConcertButton'
import ConcertPagination from '../../../src/features/concerts/components/ConcertPagination'
import ConcertAccordion from '../../../src/features/concerts/components/ConcertAccordion'
import ConcertListDisplay from '../../../src/features/concerts/ConcertListDisplay'
import { concertList } from '@repo/mock-data/ui'

const handlePageChangeMock = jest.fn()
const paginationLabel = 'pagination navigation'
const secondPage = 2

const mockAccordionProps = {
  identifier: 'test-id',
  title: 'test title',
  description: 'test description',
  expanded: 'test-id2',
  source: 'test source',
  handleChange: jest.fn(),
}

describe('Concerts Feature', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('RecordIcon renders properly', () => {
    const { getByAltText } = render(<RecordIcon />)
    expect(getByAltText('record-icon')).toBeVisible()
  })

  it('PlayConcertButton calls playConcert when clicked', async () => {
    const mockConcertId = '12345'
    const playConcertMock = jest.fn()

    const { user, getByText } = userRender(
      <PlayConcertButton
        concertId={mockConcertId}
        playConcert={playConcertMock}
      />
    )

    await user.click(getByText('Play'))
    expect(playConcertMock).toHaveBeenCalledWith(mockConcertId)
  })

  it("ConcertPagination doesn't show if there's only one page of results", () => {
    const { queryByLabelText } = render(
      <ConcertPagination
        count={1}
        pageNumber={1}
        handlePageChange={handlePageChangeMock}
      />
    )

    expect(queryByLabelText(paginationLabel)).toBeNull()
  })

  it('ConcertPagination changes page properly', async () => {
    const { user, getByText } = userRender(
      <ConcertPagination
        count={2}
        pageNumber={1}
        handlePageChange={handlePageChangeMock}
      />
    )

    await user.click(getByText(secondPage.toString()))

    expect(handlePageChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' }),
      secondPage
    )
  })

  it('ConcertAccordion properly renders concert info', async () => {
    const { title, identifier, source, description, handleChange } =
      mockAccordionProps

    const { user, getByText, rerender } = userRenderContext(
      <ConcertAccordion {...mockAccordionProps} />
    )

    await user.click(getByText(title))

    expect(handleChange).toHaveBeenCalledWith(identifier)

    rerender(
      <ConcertAccordion
        {...{ ...mockAccordionProps, expanded: identifier }}
      />
    )

    expect(getByText(source)).toBeVisible()
    expect(getByText(description)).toBeVisible()
  })

  it('ConcertAccordion allows user to play a concert', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')
    const { identifier } = mockAccordionProps

    const { user, getByText } = userRenderContext(
      <ConcertAccordion {...mockAccordionProps} />
    )

    await user.click(getByText('Play'))

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BASE_URL}/concerts/${identifier}`,
      { method: 'GET' }
    )
  })

  it('ConcertListDisplay shows record icon before initial search is made', () => {
    const { getByAltText } = contextRender(<ConcertListDisplay />)
    expect(getByAltText('record-icon')).toBeVisible()
  })

  it('ConcertListDisplay shows loading spinner while search is loading', () => {
    const { getByRole } = contextRender(<ConcertListDisplay />, {
      preloadedState: {
        concertList: {
          ...defaultAppState.concertList,
          loading: true,
        },
      },
    })
    expect(getByRole('progressbar')).toBeVisible()
  })

  it('ConcertListDisplay renders a list of concerts', async () => {
    const { user, getByText, queryByText, findByText } = userRenderContext(
      <ConcertListDisplay />,
      {
        preloadedState: {
          concertList: {
            ...defaultAppState.concertList,
            concerts: concertList,
          },
        },
      }
    )

    const [firstPage] = concertList

    for (const concert of firstPage) {
      expect(getByText(concert.title)).toBeVisible()
    }

    const [{ title, source, description }] = firstPage

    await user.click(getByText(title))

    expect(await findByText(source)).toBeVisible()
    expect(await findByText(description)).toBeVisible()

    await user.click(getByText(title))

    await waitFor(() => expect(queryByText(source)).toBeNull())
    await waitFor(() => expect(queryByText(description)).toBeNull())
  })

  it('ConcertListDisplay can change pages', async () => {
    const { user, getByText, getByTestId } = userRenderContext(
      <ConcertListDisplay />,
      {
        preloadedState: {
          concertList: {
            ...defaultAppState.concertList,
            concerts: concertList,
          },
        },
      }
    )

    await user.click(getByTestId('NavigateNextIcon'))

    const [, secondPage] = concertList

    for (const concert of secondPage) {
      expect(getByText(concert.title)).toBeVisible()
    }
  })
})
