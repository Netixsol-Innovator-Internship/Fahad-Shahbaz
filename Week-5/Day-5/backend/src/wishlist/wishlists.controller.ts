import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { WishlistService } from './wishlists.service';
import { Wishlist } from './schemas/wishlist.schema';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  async add(@Body() body: { user: string; car: string }): Promise<Wishlist> {
    return this.wishlistService.addToWishlist({
      user: body.user as any,
      car: body.car as any,
    });
  }

  @Get('user/:userId')
  async getUserWishlist(
    @Param('userId') userId: string,
  ): Promise<Wishlist | null> {
    return this.wishlistService.getUserWishlist(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.wishlistService.removeFromWishlist(id);
  }

  @Get()
  async getAll(): Promise<Wishlist[]> {
    return this.wishlistService.getAllWishlist();
  }
}
