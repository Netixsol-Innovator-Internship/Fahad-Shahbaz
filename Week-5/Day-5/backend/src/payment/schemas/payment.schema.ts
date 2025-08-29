import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auction: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bid', required: true })
  bid: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({
    default: 'pending',
    enum: ['pending', 'ready_for_shipping', 'in_transit', 'delivered', 'completed'],
  })
  status: string;

  @Prop()
  transactionId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
