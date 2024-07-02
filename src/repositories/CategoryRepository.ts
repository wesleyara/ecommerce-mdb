import { Category } from "../models/CategoryModel";

export class CategoryRepository {
  async findCategories() {
    const response = await Category.find();

    return response;
  }

  async findCategoriesByOwnerId(owner_id: unknown) {
    const response = await Category.find({ owner_id });

    return response;
  }
}
