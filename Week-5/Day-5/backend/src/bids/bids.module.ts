import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidService } from './bids.service';
import { BidController } from './bids.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }])],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService],
})
export class BidsModule {}
