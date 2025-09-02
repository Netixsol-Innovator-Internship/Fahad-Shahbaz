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
    // Validate references to avoid CastErrors and inconsistent data
    const userIdStr = String(data.user);
    const carIdStr = String(data.car);
    if (
      !Types.ObjectId.isValid(userIdStr) ||
      !Types.ObjectId.isValid(carIdStr)
    ) {
      // Mimic not found behavior by returning the existing doc (none) or throwing could be another option
      // For robustness, just return a rejected promise with NotFoundException
      throw new NotFoundException('Invalid user or car id');
    }

    const existing = await this.wishlistModel.findOne({
      user: new Types.ObjectId(userIdStr),
      car: new Types.ObjectId(carIdStr),
    });
    if (existing) return existing;

    const wishlist = new this.wishlistModel({
      user: new Types.ObjectId(userIdStr),
      car: new Types.ObjectId(carIdStr),
    });
    return wishlist.save();
  }

  async getUserWishlist(userId: string): Promise<Wishlist[]> {
    // Guard against invalid or empty ObjectId to prevent CastError and 500s
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return [];
    }
    return this.wishlistModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('car')
      .exec();
  }

  async removeFromWishlist(id: string): Promise<void> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Wishlist item not found');
    }
    const result = await this.wishlistModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!result) throw new NotFoundException('Wishlist item not found');
  }

  async getAllWishlist(): Promise<Wishlist[]> {
    return this.wishlistModel.find().populate('user').populate('car').exec();
  }
}
