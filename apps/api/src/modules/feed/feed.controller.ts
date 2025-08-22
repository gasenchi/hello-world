import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private service: FeedService) {}

  @Get()
  async getFeed(@Query('mode') mode: string = 'for-you') {
    if (mode !== 'for-you') {
      return [];
    }
    return this.service.getForYou();
  }
}
