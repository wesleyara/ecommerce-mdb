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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  @Inject(ProductsService)
  private productsService: ProductsService;

  @Get('')
  async getProducts() {
    try {
      const products = await this.productsService.findProducts();

      return {
        products,
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Post('create')
  async createProduct(
    @Body() data: CreateProductDto,
    @Headers('authorization') token: string,
  ) {
    try {
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new Error('Token not found');
      }

      const product = await this.productsService.createProduct({
        token: bearerToken,
        ...data,
      });

      return product;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Post('update/:id')
  async updateProduct(
    @Body() data: any,
    @Param('id') productId: string,
    @Headers('authorization') token: string,
  ) {
    try {
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new Error('Token not found');
      }

      if (!productId || !data) {
        throw new Error('Product ID or data not provided');
      }

      const product = await this.productsService.updateProduct({
        token: bearerToken,
        productId,
        data: {
          category_id: data.category_id,
          description: data.description,
          price: data.price,
          remove_category: data.remove_category,
          title: data.title,
        },
      });

      return { message: 'Product updated', product };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Delete('delete/:id')
  async deleteProduct(
    @Param('id') productId: string,
    @Headers('authorization') token: string,
  ) {
    try {
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new Error('Token not found');
      }

      if (!productId) {
        throw new Error('Product ID not provided');
      }

      const product = await this.productsService.deleteProduct({
        token: bearerToken,
        productId,
      });

      return { message: 'Product deleted', product };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
