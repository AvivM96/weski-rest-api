import { Module } from '@nestjs/common';
import { HotelSimulatorProvider } from './hotel-simulator-provider/hotel-simulator-provider';
import { HotelSimulatorService } from './hotel-simulator-provider/hotel-simulator-service';

@Module({
  imports: [],
  controllers: [],
  providers: [HotelSimulatorProvider, HotelSimulatorService],
  exports: [HotelSimulatorProvider],
})
export class HotelProvidersModule {}
