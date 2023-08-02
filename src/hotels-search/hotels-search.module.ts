import { Module } from '@nestjs/common';
import { HotelsSearchController } from './hotels-search.controller';
import { HotelProvidersModule } from '../hotel-providers/hotel-providers.module';
import { HotelSearchService } from './hotel-search.service';

@Module({
  imports: [HotelProvidersModule],
  controllers: [HotelsSearchController],
  providers: [HotelSearchService],
})
export class HotelsSearchModule {}
