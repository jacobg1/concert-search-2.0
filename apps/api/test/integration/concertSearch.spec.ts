import { INestApplicationContext } from '@nestjs/common'
import { AppModule } from '../../src/app.module'
import { ConcertService } from '../../src/services'
import { bootstrap } from '../utils'

// TODO - finish and unskip
describe.skip('Concert Search Integration', () => {
  let app: INestApplicationContext

  beforeEach(async () => {
    app = await bootstrap(AppModule)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('concertService properly initializes', () => {
    const concertService = app.get(ConcertService)
    expect(concertService).toBeDefined()
    expect(concertService).toBeInstanceOf(ConcertService)
  })

  it('concertService properly initializes', async () => {
    const concertService = app.get(ConcertService)
    const test = await concertService.getSingleConcert({
      pathParameters: { id: '2' },
    })
    console.log('TEST', test)
  })
})
