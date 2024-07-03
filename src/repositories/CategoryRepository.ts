import { prisma } from "../lib/prisma";
import {
  RepositoryCreateCategory,
  RepositoryUpdateCategory,
} from "../types/repository";

export class CategoryRepository {
  async createCategory({
    title,
    description,
    owner_id,
  }: RepositoryCreateCategory) {
    const category = await prisma.category.create({
      data: {
        title,
        description,
        owner: {
          connect: {
            id: owner_id,
          },
        },
      },
    });

    return category;
  }

  async findCategories() {
    const response = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    return response;
  }

  async findCategoriesByOwnerId(ownerId: string) {
    const response = await prisma.category.findMany({
      where: {
        ownerId,
      },
      include: {
        products: true,
      },
    });

    return response;
  }

  async findCategoryById(categoryId: string) {
    const response = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        products: true,
      },
    });

    return response;
  }

  async updateCategory({
    categoryId,
    data,
    remove_products,
  }: RepositoryUpdateCategory) {
    const key = remove_products ? "disconnect" : "connect";
    const changeProducts = data.productIds && data.productIds.length > 0;

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        title: data.title,
        description: data.description,
        ...(changeProducts && {
          products: {
            [key]: data.productIds?.map((id: string) => ({ id })),
          },
        }),
      },
    });

    return category;
  }

  async deleteCategory(categoryId: string) {
    const response = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return response;
  }
}
