// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Bid, BidDocument } from './schemas/bid.schema';
// import { CreateBidDto } from './dto/create-bid.dto';

// @Injectable()
// export class BidService {
//   constructor(
//     @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
//   ) {}

//   async create(createBidDto: CreateBidDto): Promise<Bid> {
//     const bid = new this.bidModel(createBidDto);
//     return bid.save();
//   }

//   async findAll(): Promise<Bid[]> {
//     return this.bidModel.find().populate('auction').populate('bidder').exec();
//   }

//   async findOne(id: string): Promise<Bid> {
//     const bid = await this.bidModel.findById(id).populate('auction').populate('bidder').exec();
//     if (!bid) throw new NotFoundException('Bid not found');
//     return bid;
//   }

//   async remove(id: string): Promise<void> {
//     const result = await this.bidModel.findByIdAndDelete(id).exec();
//     if (!result) throw new NotFoundException('Bid not found');
//   }
// }

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Auction, AuctionDocument } from '../auction/schemas/auction.schema';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
  ) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    // Validate auction exists
    const auction = await this.auctionModel
      .findById(createBidDto.auction)
      .exec();
    if (!auction) throw new NotFoundException('Auction not found');

    // Enforce time/status window
    const now = new Date();
    const start = new Date((auction as any).startTime);
    const end = new Date((auction as any).endTime);
    const status = (auction as any).status;
    // If marked live, allow bids regardless of start time; always block ended/completed
    if (status === 'ended' || status === 'completed' || now >= end) {
      throw new BadRequestException('Auction has ended');
    }
    if (status !== 'live' && now < start) {
      throw new BadRequestException('Auction is not live yet');
    }

    // Enforce minimum increment (>= currentPrice + 1)
    const minNext = (auction.currentPrice || 0) + 1;
    if (createBidDto.amount < minNext) {
      throw new BadRequestException(`Bid must be at least ${minNext}`);
    }

    // Create bid
    const bid = await new this.bidModel(createBidDto).save();

    // Update auction currentPrice and winningBid
    auction.currentPrice = createBidDto.amount;
    (auction as any).winningBid = bid._id as any;
    if (now >= start && now < end && (auction as any).status !== 'live') {
      (auction as any).status = 'live';
    }
    await auction.save();

    // Return populated bid
    return this.bidModel
      .findById(bid._id)
      .populate('auction')
      .populate('bidder')
      .exec() as unknown as Promise<Bid>;
  }

  async findAll(): Promise<Bid[]> {
    return this.bidModel.find().populate('auction').populate('bidder').exec();
  }

  async findOne(id: string): Promise<Bid> {
    const bid = await this.bidModel
      .findById(id)
      .populate('auction')
      .populate('bidder')
      .exec();
    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }

  async update(id: string, updateBidDto: UpdateBidDto): Promise<Bid> {
    const bid = await this.bidModel
      .findByIdAndUpdate(id, updateBidDto, { new: true })
      .populate('auction')
      .populate('bidder')
      .exec();

    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bidModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Bid not found');
  }
}
