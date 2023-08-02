import { Injectable, Logger } from '@nestjs/common';
import { HotelSimulatorService } from './hotel-simulator-service';
import { BaseHotelProvider } from '../base-hotel-provider';
import {
  HotelProviderEvent,
  HotelSearchDataMessage,
} from '../hotel-provider.types';
import {
  Hotel,
  HotelSearchRequest,
} from '../../hotels-search/hotel-search.types';
import {
  HotelSimulatorQuery,
  HotelSimulatorSearchRequest,
  HotelSimulatorSearchResponse,
} from './hotel-simulator.types';

@Injectable()
export class HotelSimulatorProvider extends BaseHotelProvider {
  private readonly logger = new Logger(HotelSimulatorProvider.name);

  constructor(private readonly hotelSimulatorService: HotelSimulatorService) {
    super();
  }

  public async search(hotelSearch: HotelSearchRequest, searchId: string) {
    const simulatorSearchRequests = this.buildSearchRequests(hotelSearch);

    await Promise.all(
      simulatorSearchRequests.map((request) =>
        this.handleSearchRequest(request, searchId),
      ),
    );

    this.completeSearch(searchId);
    this.logger.log(`[search] completed searchId: ${searchId}`);
  }

  private async handleSearchRequest(
    simulatorSearchRequest: HotelSimulatorSearchRequest,
    searchId: string,
  ) {
    try {
      const response = await this.hotelSimulatorService.searchHotels(
        simulatorSearchRequest,
      );

      // TODO: emit failure event
      if (response.statusCode !== 200) {
        this.logger.error(
          `[handleSearchRequest] failed executing search request`,
        );
        return;
      }

      const searchDataMessage: HotelSearchDataMessage = {
        event: HotelProviderEvent.SearchData,
        data: {
          completed: false,
          searchId,
          hotels: this.normalizeSearchResponse(response),
        },
      };

      this.eventEmitter.emit(HotelProviderEvent.SearchData, searchDataMessage);
    } catch (e) {
      this.logger.log(
        `[handleSearchRequest] failed to handle search request, Error: ${e.message}`,
        e.stack,
      );
    }
  }

  private buildSearchRequests(
    hotelSearch: HotelSearchRequest,
  ): HotelSimulatorSearchRequest[] {
    const simulatorRequestBody: Partial<HotelSimulatorQuery> = {
      ski_site: hotelSearch.site,
      from_date: hotelSearch.startDate,
      to_date: hotelSearch.endDate,
    };

    const [start, end] = hotelSearch.groupSizeRange;
    return Array.from({ length: end - start + 1 }).map((_, index) => ({
      query: {
        ...simulatorRequestBody,
        group_size: index + start,
      } as HotelSimulatorQuery,
    }));
  }

  private normalizeSearchResponse(
    simulatorSearchResponse: HotelSimulatorSearchResponse,
  ): Hotel[] {
    return simulatorSearchResponse.body.accommodations.map((accommodation) => ({
      code: accommodation.HotelCode,
      name: accommodation.HotelName,
      images: accommodation.HotelDescriptiveContent.Images.map((image) => ({
        url: image.URL,
        cover: image?.MainImage === 'True',
      })),
      location: {
        lat: accommodation.HotelInfo.Position.Latitude,
        long: accommodation.HotelInfo.Position.Longitude,
        nearBy: accommodation.HotelInfo.Position.Distances.map((distance) => ({
          name: distance.type,
          distance: distance.distance,
        })),
      },
      rating: Number(accommodation.HotelInfo.Rating),
      beds: Number(accommodation.HotelInfo.Rating),
      priceBeforeTax: accommodation.PricesInfo.AmountBeforeTax,
      priceAfterTax: accommodation.PricesInfo.AmountAfterTax,
    }));
  }
}
