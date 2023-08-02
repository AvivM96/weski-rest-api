import { Hotel } from '../hotels-search/hotel-search.types';

export enum HotelProviderEvent {
  SearchData = 'searchData',
}

export type HotelProviderEventMessage<T> = {
  event: HotelProviderEvent;
  data: T;
};

export type HotelSearchDataMessage = HotelProviderEventMessage<{
  completed: boolean;
  searchId: string;
  hotels: Hotel[];
}>;
