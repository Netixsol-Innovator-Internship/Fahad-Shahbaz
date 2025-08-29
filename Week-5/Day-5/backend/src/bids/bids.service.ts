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


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
  ) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const bid = new this.bidModel(createBidDto);
    return bid.save();
  }

  async findAll(): Promise<Bid[]> {
    return this.bidModel.find().populate('auction').populate('bidder').exec();
  }

  async findOne(id: string): Promise<Bid> {
    const bid = await this.bidModel.findById(id).populate('auction').populate('bidder').exec();
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
