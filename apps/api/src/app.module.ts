import { Module } from '@nestjs/common'
import { ConcertModule } from './services'

@Module({
  imports: [ConcertModule],
  providers: [],
})
export class AppModule {}
