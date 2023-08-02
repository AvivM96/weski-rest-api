export type Hotel = {
  code: string;
  name: string;
  images: HotelImage[];
  location: HotelLocation;
  rating: number;
  beds: number;
  priceBeforeTax: string;
  priceAfterTax: string;
};

export type HotelLocation = {
  lat: string;
  long: string;
  nearBy: HotelNearBy[];
};

export type HotelNearBy = {
  name: string;
  distance: string;
};

export type HotelImage = {
  url: string;
  cover: boolean;
};

export type HotelSearchRequest = {
  site: number;
  startDate: string;
  endDate: string;
  groupSizeRange: [number, number];
};

export type HotelSearchResponse = {
  searchId: string;
};

export type HotelSearchResult = {
  completed: boolean;
  site: number;
  startDate: string;
  endDate: string;
  groupSizeRange: [number, number];
  hotels: Hotel[];
};
