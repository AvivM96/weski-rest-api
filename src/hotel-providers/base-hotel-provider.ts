import { HotelSearchRequest } from '../hotels-search/hotel-search.types';
import { HotelProviderEvent } from './hotel-provider.types';
import { EventEmitter } from 'events';
export interface HotelProviderInterface {
  search(hotelSearch: HotelSearchRequest, searchId: string): void;
  register(event: HotelProviderEvent, onEvent: () => void);
}

export abstract class BaseHotelProvider implements HotelProviderInterface {
  protected eventEmitter = new EventEmitter();
  abstract search(hotelSearch: HotelSearchRequest, searchId: string): void;

  public register(
    event: HotelProviderEvent,
    onEvent: (message: HotelProviderEvent) => void,
  ) {
    this.eventEmitter.on(event, onEvent);
  }

  protected completeSearch(searchId: string) {
    this.eventEmitter.emit(HotelProviderEvent.SearchData, {
      event: HotelProviderEvent,
      data: { completed: true, hotels: [], searchId },
    });
  }
}
