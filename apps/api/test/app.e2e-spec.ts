import { INestApplicationContext } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import { ConcertService } from '../src/services'

describe('AppController (e2e)', () => {
  let app: INestApplicationContext

  beforeEach(async () => {
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'log', 'warn'],
    })
  })

  it('concertService properly initializes', () => {
    const concertService = app.get(ConcertService)
    expect(concertService).toBeDefined()
    expect(concertService).toBeInstanceOf(ConcertService)
  })
})
