import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CategoriesService)
  private categoriesService: CategoriesService;

  @Get('')
  async getCategories() {
    try {
      const categories = await this.categoriesService.findCategories();

      return {
        categories,
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Post('create')
  async createCategories(
    @Body() data: CreateCategoryDto,
    @Headers('authorization') token: string,
  ) {
    try {
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new Error('Token not found');
      }

      const category = await this.categoriesService.createCategory({
        token: bearerToken,
        ...data,
      });

      return category;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Post('update/:id')
  async updateProduct(
    @Body() data: any,
    @Param('id') categoryId: string,
    @Headers('authorization') token: string,
  ) {
    try {
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new Error('Token not found');
      }

      if (!categoryId || !data) {
        throw new Error('Category ID or data not provided');
      }

      const category = await this.categoriesService.updateCategory({
        token: bearerToken,
        categoryId,
        data: {
          description: data.description,
          productIds: data.productIds,
          remove_products: data.remove_products,
          title: data.title,
        },
      });

      return { message: 'Category updated', category };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Delete('delete/:id')
  async deleteProduct(
    @Param('id') categoryId: string,
    @Headers('authorization') token: string,
  ) {
    try {
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new Error('Token not found');
      }

      if (!categoryId) {
        throw new Error('Product ID not provided');
      }

      const category = await this.categoriesService.deleteCategory({
        token: bearerToken,
        categoryId,
      });

      return { message: 'Category deleted', category };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
