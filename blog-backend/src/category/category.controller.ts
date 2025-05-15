import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';

@Controller('api/categories')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return this.categoryService.getAllCategories();
  }
}
