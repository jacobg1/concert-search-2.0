import { Module } from '@nestjs/common'
import { ConcertService } from './concert.service'

@Module({
  imports: [],
  controllers: [],
  providers: [ConcertService],
  exports: [ConcertService],
})
export class ConcertModule {}
