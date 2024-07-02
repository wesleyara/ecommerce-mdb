import { Category } from "../models/CategoryModel";
import {
  RepositoryCreateCategory,
  RepositoryUpdateCategory,
  UpdateRelationsProps,
} from "../types/repository";

export class CategoryRepository {
  async createCategory({
    title,
    description,
    owner_id,
  }: RepositoryCreateCategory) {
    const category = await Category.create({
      title,
      description,
      owner_id,
    });

    await category.save();

    return category;
  }

  async findCategories() {
    const response = await Category.find().populate("products");

    return response;
  }

  async findCategoriesByOwnerId(owner_id: unknown) {
    const response = await Category.find({ owner_id }).populate("products");

    return response;
  }

  async findCategoryById(categoryId: unknown) {
    const response = await Category.findById(categoryId).populate("products");

    return response;
  }

  async updateCategory({
    categoryId,
    title,
    description,
  }: RepositoryUpdateCategory) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        title,
        description,
      },
      { new: true },
    );

    return category;
  }

  async updateRelations({ modelId, type, typeIds }: UpdateRelationsProps) {
    try {
      await Category.findByIdAndUpdate(modelId, {
        $push: { [type]: typeIds },
      });
    } catch (error) {
      throw new Error(`${type} not updated`);
    }
  }

  async removeRelations({ modelId, type, typeIds }: UpdateRelationsProps) {
    try {
      await Category.findByIdAndUpdate(modelId, {
        $pullAll: { [type]: typeIds },
      });
    } catch (error) {
      throw new Error(`${type} not removed`);
    }
  }

  async deleteCategory(categoryId: unknown) {
    const response = await Category.findByIdAndDelete(categoryId);

    return response;
  }
}
