import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsMongoId()
  auction: string; // Auction ID

  @IsNotEmpty()
  @IsMongoId()
  bidder: string; // User ID

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number; // Bid amount
}
