import { render, screen } from '@testing-library/react'
import { concertList } from '@repo/mock-data/ui'
import {
  contextRender,
  defaultAppState,
  testConcertListItem,
  userRender,
  userRenderContext,
} from '../../utils'
import { RecordIcon } from '../../../src/features/concerts/components/RecordIcon'
import PlayConcertButton from '../../../src/features/concerts/components/PlayConcertButton'
import ConcertPagination from '../../../src/features/concerts/components/ConcertPagination'
import ConcertAccordion from '../../../src/features/concerts/components/ConcertAccordion'
import ConcertListDisplay from '../../../src/features/concerts/ConcertListDisplay'

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
    render(<RecordIcon />)
    expect(screen.getByAltText('record-icon')).toBeVisible()
  })

  it('PlayConcertButton calls playConcert when clicked', async () => {
    const mockConcertId = '12345'
    const playConcertMock = jest.fn()

    const { user } = userRender(
      <PlayConcertButton
        concertId={mockConcertId}
        playConcert={playConcertMock}
      />
    )

    await user.click(screen.getByText('Play'))
    expect(playConcertMock).toHaveBeenCalledWith(mockConcertId)
  })

  it("ConcertPagination doesn't show if there's only one page of results", () => {
    render(
      <ConcertPagination
        count={1}
        pageNumber={1}
        handlePageChange={handlePageChangeMock}
      />
    )

    expect(screen.queryByLabelText(paginationLabel)).toBeNull()
  })

  it('ConcertPagination changes page properly', async () => {
    const { user } = userRender(
      <ConcertPagination
        count={2}
        pageNumber={1}
        handlePageChange={handlePageChangeMock}
      />
    )

    await user.click(screen.getByText(secondPage.toString()))

    expect(handlePageChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' }),
      secondPage
    )
  })

  it('ConcertAccordion properly renders concert info', async () => {
    const { title, identifier, source, description, handleChange } =
      mockAccordionProps

    const { user, rerender } = userRenderContext(
      <ConcertAccordion {...mockAccordionProps} />
    )

    await user.click(screen.getByText(title))

    expect(handleChange).toHaveBeenCalledWith(identifier)

    rerender(
      <ConcertAccordion
        {...{ ...mockAccordionProps, expanded: identifier }}
      />
    )

    expect(screen.getByText(source)).toBeVisible()
    expect(screen.getByText(description)).toBeVisible()
  })

  it('ConcertAccordion allows user to play a concert', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')
    const { identifier } = mockAccordionProps

    const { user } = userRenderContext(
      <ConcertAccordion {...mockAccordionProps} />
    )

    await user.click(screen.getByText('Play'))

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BASE_URL}/concerts/${identifier}`,
      { method: 'GET' }
    )
  })

  it('ConcertListDisplay shows record icon before initial search is made', () => {
    contextRender(<ConcertListDisplay />)
    expect(screen.getByAltText('record-icon')).toBeVisible()
  })

  it('ConcertListDisplay shows loading spinner while search is loading', () => {
    contextRender(<ConcertListDisplay />, {
      preloadedState: {
        concertList: {
          ...defaultAppState.concertList,
          loading: true,
        },
      },
    })
    expect(screen.getByRole('progressbar')).toBeVisible()
  })

  it('ConcertListDisplay renders a list of concerts', async () => {
    const { user } = userRenderContext(<ConcertListDisplay />, {
      preloadedState: {
        concertList: {
          ...defaultAppState.concertList,
          concerts: concertList,
        },
      },
    })

    const [firstPage] = concertList
    const [firstConcert] = firstPage

    await testConcertListItem(user, firstConcert)
  })

  it('ConcertListDisplay can change pages', async () => {
    const { user } = userRenderContext(<ConcertListDisplay />, {
      preloadedState: {
        concertList: {
          ...defaultAppState.concertList,
          concerts: concertList,
        },
      },
    })

    await user.click(screen.getByTestId('NavigateNextIcon'))

    const [, secondPage] = concertList
    const [firstConcert] = secondPage

    await testConcertListItem(user, firstConcert)
  })
})
