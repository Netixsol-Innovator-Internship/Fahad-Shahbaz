// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type AuctionDocument = Auction & Document;

// @Schema({ timestamps: true })
// export class Auction {
//   @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
//   car: Types.ObjectId;

//   @Prop({ required: true })
//   startTime: Date;

//   @Prop({ required: true })
//   endTime: Date;

//   @Prop({ default: 'upcoming', enum: ['upcoming', 'live', 'ended', 'completed'] })
//   status: string;

//   @Prop({ default: 0 })
//   currentPrice: number;

//   @Prop({ type: Types.ObjectId, ref: 'Bid', default: null })
//   winningBid: Types.ObjectId | null;
// }

// export const AuctionSchema = SchemaFactory.createForClass(Auction);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionDocument = Auction & Document;

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({
    default: 'upcoming',
    enum: ['upcoming', 'live', 'ended', 'completed'],
  })
  status: string;

  @Prop({ default: 0 })
  currentPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'Bid', default: null })
  winningBid: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  // Virtual field for bids
  bids?: any[];
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

// Enable virtuals for serialization
AuctionSchema.set('toObject', { virtuals: true });
AuctionSchema.set('toJSON', { virtuals: true });

// Virtual relation to bids (Bid.auction -> Auction._id)
AuctionSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'auction',
});
