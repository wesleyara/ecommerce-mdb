import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  RepositoryCreateProduct,
  RepositoryUpdateManyProducts,
  RepositoryUpdateProduct,
} from './interface/products.interface';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createProduct({
    title,
    description,
    price,
    owner_id,
  }: RepositoryCreateProduct) {
    const product = await this.prisma.products.create({
      data: {
        title,
        description,
        price,
        owner: {
          connect: {
            id: owner_id,
          },
        },
      },
    });

    return product;
  }

  async findProducts() {
    const response = await this.prisma.products.findMany();

    return response;
  }

  async findProductsByOwnerId(owner_id: string) {
    const response = await this.prisma.products.findMany({
      where: {
        ownerId: owner_id,
      },
    });

    return response;
  }

  async findProductById(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        owner: true,
      },
    });

    return product;
  }

  async findProductsByIds(productIds: string[]) {
    const products = await this.prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return products;
  }

  async findProductsByCategoryId(category_id: string) {
    const products = await this.prisma.products.findMany({
      where: {
        categoryId: category_id,
      },
    });

    return products;
  }

  async updateProduct({
    productId,
    data,
    remove_category,
  }: RepositoryUpdateProduct) {
    const response = await this.prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        ...(data.categoryId && {
          category: {
            connect: {
              id: data.categoryId,
            },
          },
        }),
        ...(remove_category && {
          category: {
            disconnect: true,
          },
        }),
      },
    });

    return response;
  }

  async updateManyProducts({
    productIds,
    category_id,
    remove_category,
  }: RepositoryUpdateManyProducts) {
    const products = await this.prisma.products.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        categoryId: remove_category ? null : category_id,
      },
    });

    return products;
  }

  async deleteProductById(productId: string) {
    const product = await this.prisma.products.delete({
      where: {
        id: productId,
      },
    });

    return product;
  }
}
