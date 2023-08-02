import { Injectable } from '@nestjs/common';
import {
  HotelSimulatorSearchRequest,
  HotelSimulatorSearchResponse,
} from './hotel-simulator.types';
import axios from 'axios';

@Injectable()
export class HotelSimulatorService {
  async searchHotels(
    searchRequest: HotelSimulatorSearchRequest,
  ): Promise<HotelSimulatorSearchResponse> {
    return (await axios.post(this.url, searchRequest)).data;
  }

  // should be on config
  private get url() {
    return 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator';
  }
}
