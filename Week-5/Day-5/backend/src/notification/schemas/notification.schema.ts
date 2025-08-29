// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type NotificationDocument = Notification & Document;

// @Schema({ timestamps: true })
// export class Notification {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   user: Types.ObjectId;

//   @Prop({
//     required: true,
//     enum: ['bid_start', 'new_bid', 'bid_winner', 'bid_ended'],
//   })
//   type: string;

//   @Prop({ required: true })
//   message: string;

//   @Prop({ type: Types.ObjectId, ref: 'Auction' })
//   auction: Types.ObjectId;

//   @Prop({ default: false })
//   read: boolean;
// }

// export const NotificationSchema = SchemaFactory.createForClass(Notification);
