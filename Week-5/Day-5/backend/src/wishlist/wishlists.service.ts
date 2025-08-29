import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async addToWishlist(data: {
    user: Types.ObjectId;
    car: Types.ObjectId;
  }): Promise<Wishlist> {
    const existing = await this.wishlistModel.findOne({
      user: data.user,
      car: data.car,
    });
    if (existing) return existing;

    const wishlist = new this.wishlistModel(data);
    return wishlist.save();
  }

  async getUserWishlist(userId: string): Promise<Wishlist | null> {
    return this.wishlistModel.findOne({ user: userId }).populate('car').exec();
  }

  async removeFromWishlist(id: string): Promise<void> {
    const result = await this.wishlistModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Wishlist item not found');
  }

  async getAllWishlist(): Promise<Wishlist[]> {
    return this.wishlistModel.find().populate('user').populate('car').exec();
  }
}
