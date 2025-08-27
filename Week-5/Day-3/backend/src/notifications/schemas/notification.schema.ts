import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  target: Types.ObjectId | null;

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: Object, default: {} })
  data: any;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
