import { Injectable, Logger } from '@nestjs/common';
import { HotelProviderInterface } from '../hotel-providers/base-hotel-provider';
import { HotelSimulatorProvider } from '../hotel-providers/hotel-simulator-provider/hotel-simulator-provider';
import {
  Hotel,
  HotelSearchRequest,
  HotelSearchResult,
} from './hotel-search.types';
import {
  HotelProviderEvent,
  HotelSearchDataMessage,
} from '../hotel-providers/hotel-provider.types';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class HotelSearchService {
  private readonly logger = new Logger(HotelSearchService.name);

  private hotelProviders: HotelProviderInterface[];
  private cache: Map<string, HotelSearchResult> = new Map<
    string,
    HotelSearchResult
  >();

  constructor(private readonly hotelSimulatorProvider: HotelSimulatorProvider) {
    this.hotelProviders = [hotelSimulatorProvider];
    this.register();
  }

  public search(searchRequest: HotelSearchRequest): string {
    const searchId = uuidv4();

    this.logger.log(
      `[search] received search request, using searchId: ${searchId}`,
    );

    this.setNewSearch(searchRequest, searchId);

    this.hotelProviders.forEach((hotelProvider) =>
      hotelProvider.search(searchRequest, searchId),
    );

    return searchId;
  }

  public getSearchResult(searchId: string): Partial<HotelSearchResult> {
    return this.getCachedResult(searchId);
  }

  private register() {
    this.hotelProviders.forEach((hotelProvider) => {
      hotelProvider.register(
        HotelProviderEvent.SearchData,
        this.handleSearchResult.bind(this),
      );
    });
  }

  private handleSearchResult(message: HotelSearchDataMessage) {
    const searchId = message.data.searchId;

    this.logger.log(
      `[handleSearchResult] received data for searchId: ${searchId}`,
    );

    const searchData = this.getCachedResult(searchId) as HotelSearchResult;

    // might need to handle multiple room sizes from same hotel, maybe provide the smallest one
    this.cache.set(searchId, {
      ...searchData,
      completed: message.data.completed,
      hotels: _.sortBy(
        _.uniqBy(
          [...searchData.hotels, ...message.data.hotels],
          (hotel) => hotel.code,
        ),
        (hotel) => Number(hotel.priceBeforeTax),
      ),
    });

    this.logger.log(
      `[handleSearchResult] completed search cache update for searchId: ${searchId}`,
    );
  }

  private setNewSearch(searchRequest: HotelSearchRequest, searchId: string) {
    return this.cache.set(searchId, {
      completed: false,
      hotels: [],
      ...searchRequest,
    });
  }

  private getCachedResult(searchId: string): Partial<HotelSearchResult> {
    return this.cache.get(searchId) || { completed: false, hotels: [] };
  }
}
