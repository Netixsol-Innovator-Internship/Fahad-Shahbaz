import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = new this.carModel(createCarDto);
    return car.save();
  }

  async findAll(): Promise<Car[]> {
    return this.carModel.find().populate('uploadedBy', 'name email').exec();
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).populate('uploadedBy', 'name email').exec();
    if (!car) throw new NotFoundException(`Car with ID "${id}" not found`);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
    if (!car) throw new NotFoundException(`Car with ID "${id}" not found`);
    return car;
  }

  async remove(id: string): Promise<Car> {
    const car = await this.carModel.findByIdAndDelete(id).exec();
    if (!car) throw new NotFoundException(`Car with ID "${id}" not found`);
    return car;
  }
}
