import { prisma } from "../lib/prisma";
import {
  RepositoryCreateProduct,
  RepositoryUpdateManyProducts,
  RepositoryUpdateProduct,
} from "../types/repository";

export class ProductRepository {
  async createProduct({
    title,
    description,
    price,
    owner_id,
  }: RepositoryCreateProduct) {
    const product = await prisma.products.create({
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
    const response = await prisma.products.findMany();

    return response;
  }

  async findProductsByOwnerId(owner_id: string) {
    const response = await prisma.products.findMany({
      where: {
        ownerId: owner_id,
      },
    });

    return response;
  }

  async findProductById(productId: string) {
    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  }

  async findProductsByIds(productIds: string[]) {
    const products = await prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return products;
  }

  async findProductsByCategoryId(category_id: string) {
    const products = await prisma.products.findMany({
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
    const key = remove_category ? "disconnect" : "connect";

    const response = await prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        ...(data.categoryId && {
          category: {
            [key]: {
              id: data.categoryId,
            },
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
    const products = await prisma.products.updateMany({
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
    const product = await prisma.products.delete({
      where: {
        id: productId,
      },
    });

    return product;
  }
}
