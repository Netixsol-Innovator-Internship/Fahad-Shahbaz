import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidService } from './bids.service';
import { BidController } from './bids.controller';
import { Auction, AuctionSchema } from '../auction/schemas/auction.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService],
})
export class BidsModule {}
