import { Category } from "../models/CategoryModel";
import { RepositoryCreateCategory } from "../types";

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
    const response = await Category.find();

    return response;
  }

  async findCategoriesByOwnerId(owner_id: unknown) {
    const response = await Category.find({ owner_id });

    return response;
  }
}
