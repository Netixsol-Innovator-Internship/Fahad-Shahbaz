import { IsMongoId, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateAuctionDto {
  @IsMongoId()
  car: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsEnum(['upcoming', 'live', 'ended', 'completed'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  currentPrice?: number;

  @IsMongoId()
  @IsOptional()
  winningBid?: string;

  @IsMongoId()
  createdBy: string;
}
