import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('logo') logo?: string,
  ): Promise<Category> {
    return this.categoriesService.create(name, logo);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Category>,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
