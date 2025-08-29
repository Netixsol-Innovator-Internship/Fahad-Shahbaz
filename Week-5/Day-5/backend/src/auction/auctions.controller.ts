import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AuctionService } from './auctions.service';
import { Auction } from './schemas/auction.schema';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async create(@Body() createAuctionDto: any): Promise<Auction> {
    return this.auctionService.create(createAuctionDto);
  }

  @Get()
  async findAll(): Promise<Auction[]> {
    return this.auctionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Auction> {
    return this.auctionService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuctionDto: any,
  ): Promise<Auction> {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.auctionService.remove(id);
    return { message: 'Auction deleted successfully' };
  }
}
