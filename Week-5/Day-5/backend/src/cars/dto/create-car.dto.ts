import { IsString, IsNumber, IsArray, IsOptional, IsMongoId } from 'class-validator';

export class CreateCarDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsString()
  category: string;

  @IsString()
  bodyType: string;

  @IsMongoId()
  uploadedBy: string;
}
