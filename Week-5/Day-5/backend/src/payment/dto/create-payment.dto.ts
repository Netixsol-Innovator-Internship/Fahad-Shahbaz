import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePaymentDto {
  @IsNotEmpty()
  auction: Types.ObjectId;

  @IsNotEmpty()
  user: Types.ObjectId;

  @IsNotEmpty()
  bid: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsEnum(['pending', 'ready_for_shipping', 'in_transit', 'delivered', 'completed'])
  status?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
