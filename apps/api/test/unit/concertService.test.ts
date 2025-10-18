import { archiveSearch } from 'archive-search'
import { concertList, singleConcert } from '@repo/mock-data/post-api'
import { INestApplicationContext } from '@nestjs/common'
import { AppModule } from '../../src/app.module'
import { ConcertService } from '../../src/services'
import { bootstrap } from '../utils'
import { MediaFormat, SortOrder } from '../../src/interface'

const mockSearch = jest.spyOn(archiveSearch, 'search')
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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('getConcertList properly retrieves a concert list', async () => {
    mockSearch.mockResolvedValue(concertList)

    const mockInput = {
      searchTerm: 'TestSearch',
      max: 50,
      filterDuplicates: false,
      sortBy: { downloads: SortOrder.DESC },
      mediaFormat: ['mp3' as MediaFormat, 'ogg' as MediaFormat],
    }

    const response = await concertService.getConcertList({ body: mockInput })

    expect(response.length).toBeGreaterThan(0)

    response.forEach((page) => {
      expect(page.length).toBeGreaterThan(0)
    })
  })

  xit('getSingleConcert properly retrieves a single concert', async () => {
    mockMetaSearch.mockResolvedValue(singleConcert)

    const { trackList, metadata } = await concertService.getSingleConcert({
      pathParameters: { id: mockConcertId },
    })

    expect(trackList.length).toBeGreaterThan(0)
    expect(mockMetaSearch).toHaveBeenCalledWith(mockConcertId)

    trackList.forEach(({ title, link, length }) => {
      expect(title).toBeDefined()
      expect(link).toBeDefined()
      expect(length).toBeDefined()
      expect(link).toContain('https://')
    })

    const metadataFields = ['creator', 'date', 'description', 'venue', 'source']

    for (const field of metadataFields) {
      expect(metadata[field as keyof typeof metadata]).toBeDefined()
    }
  })
})
