// import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
// import { BidService } from './bids.service';
// import { CreateBidDto } from './dto/create-bid.dto';

// @Controller('bids')
// export class BidController {
//   constructor(private readonly bidService: BidService) {}

//   @Post()
//   create(@Body() createBidDto: CreateBidDto) {
//     return this.bidService.create(createBidDto);
//   }

//   @Get()
//   findAll() {
//     return this.bidService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.bidService.findOne(id);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.bidService.remove(id);
//   }
// }

import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BidService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto);
  }

  @Get()
  findAll() {
    return this.bidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(id, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidService.remove(id);
  }
}
