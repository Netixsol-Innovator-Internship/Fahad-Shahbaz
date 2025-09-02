import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
  ) {}

  async create(createAuctionDto: any): Promise<Auction> {
    const auction = new this.auctionModel(createAuctionDto);
    return auction.save();
  }

  async findAll(): Promise<Auction[]> {
    return this.auctionModel
      .find()
      .populate('car')
      .populate({ path: 'bids', populate: { path: 'bidder' } })
      .populate({ path: 'winningBid', populate: { path: 'bidder' } })
      .exec();
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionModel
      .findById(id)
      .populate('car')
      .populate({ path: 'bids', populate: { path: 'bidder' } })
      .populate({ path: 'winningBid', populate: { path: 'bidder' } })
      .exec();
    if (!auction)
      throw new NotFoundException(`Auction with ID ${id} not found`);

    // Log the populated auction data
    console.log(`\n=== AUCTION ${id} ===`);
    console.log('Bids count:', (auction as any).bids?.length || 0);
    if ((auction as any).bids?.length > 0) {
      console.log(
        'First bid:',
        JSON.stringify((auction as any).bids[0], null, 2),
      );
    }
    console.log('========================\n');

    return auction;
  }

  async update(id: string, updateAuctionDto: any): Promise<Auction> {
    const updatedAuction = await this.auctionModel
      .findByIdAndUpdate(id, updateAuctionDto, { new: true })
      .exec();
    if (!updatedAuction)
      throw new NotFoundException(`Auction with ID ${id} not found`);
    return updatedAuction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.auctionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Auction with ID ${id} not found`);
  }
}
