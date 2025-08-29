import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionService } from './auctions.service';
import { AuctionController } from './auctions.controller';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema'; // in case we need populate car later

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: Car.name, schema: CarSchema },
    ]),
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
