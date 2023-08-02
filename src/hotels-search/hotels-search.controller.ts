import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { HotelSearchService } from './hotel-search.service';
import { HotelSearchRequest } from './hotel-search.types';

@Controller('hotels')
export class HotelsSearchController {
  constructor(private readonly hotelSearchService: HotelSearchService) {}

  @Post('/search')
  search(@Res() res, @Body() body: HotelSearchRequest): string {
    try {
      const searchId = this.hotelSearchService.search(body);
      return res.status(200).json({
        searchId,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
      });
    }
  }

  @Get('/search/:searchId')
  getSearchResult(@Res() res, @Param('searchId') searchId: string): string {
    try {
      const result = this.hotelSearchService.getSearchResult(searchId);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({
        success: false,
      });
    }
  }
}
