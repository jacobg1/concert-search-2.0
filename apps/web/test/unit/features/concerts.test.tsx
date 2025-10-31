import { render } from '@testing-library/react'
import { userRender } from '../../utils'
import { RecordIcon } from '../../../src/features/concerts/components/RecordIcon'
import PlayConcertButton from '../../../src/features/concerts/components/PlayConcertButton'
import ConcertPagination from '../../../src/features/concerts/components/ConcertPagination'

const handlePageChangeMock = jest.fn()
const paginationLabel = 'pagination navigation'
const secondPage = 2

describe('Concerts Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
})
