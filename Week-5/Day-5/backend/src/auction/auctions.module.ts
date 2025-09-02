import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionService } from './auctions.service';
import { AuctionController } from './auctions.controller';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { Bid, BidSchema } from '../bids/schemas/bid.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: Car.name, schema: CarSchema },
      { name: Bid.name, schema: BidSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
