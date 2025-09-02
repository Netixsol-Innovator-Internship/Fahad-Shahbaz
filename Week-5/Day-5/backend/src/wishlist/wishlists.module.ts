import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistService } from './wishlists.service';
import { WishlistController } from './wishlists.controller';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wishlist.name, schema: WishlistSchema },
      { name: Car.name, schema: CarSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
