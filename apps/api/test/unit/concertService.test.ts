import { archiveSearch } from 'archive-search'
import { singleConcert } from '@repo/mock-data/api'
import { INestApplicationContext } from '@nestjs/common'
import { AppModule } from '../../src/app.module'
import { ConcertService } from '../../src/services'
import { bootstrap } from '../utils'

// const mockSearch = jest.spyOn(archiveSearch, 'search')
const mockMetaSearch = jest.spyOn(archiveSearch, 'metaSearch')

const mockConcertId = '4'

// TODO - finish these tests
describe('ConcertService Unit Tests', () => {
  let app: INestApplicationContext
  let concertService: ConcertService

  beforeEach(async () => {
    app = await bootstrap(AppModule)
    concertService = app.get(ConcertService)
  })

  it('getSingleConcert properly retrieves a single concert', async () => {
    mockMetaSearch.mockResolvedValue(singleConcert)

    const response = await concertService.getSingleConcert({
      pathParameters: { id: mockConcertId },
    })

    expect(response.trackList.length).toBeGreaterThan(0)
    expect(mockMetaSearch).toHaveBeenCalledWith(mockConcertId)
  })
})
