import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelsSearchModule } from './hotels-search/hotels-search.module';

@Module({
  imports: [HotelsSearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
