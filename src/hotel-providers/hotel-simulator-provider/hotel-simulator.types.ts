export type HotelSimulatorSearchRequest = {
  query: HotelSimulatorQuery;
};

export type HotelSimulatorQuery = {
  ski_site: number;
  from_date: string;
  to_date: string;
  group_size: number;
};

export type HotelSimulatorSearchResponse = {
  statusCode: number;
  body: {
    success: string;
    accommodations: HotelSimulatorAccommodation[];
  };
};

export type HotelSimulatorAccommodation = {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent: {
    Images: {
      URL: string;
      MainImage?: string;
    }[];
  };
  HotelInfo: {
    Position: {
      Latitude: string;
      Longitude: string;
      Distances: {
        type: string;
        distance: string;
      }[];
    };
    Rating: string;
    Beds: string;
  };
  PricesInfo: {
    AmountAfterTax: string;
    AmountBeforeTax: string;
  };
};
