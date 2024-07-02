import { Category } from "../models/CategoryModel";
import {
  RepositoryCreateCategory,
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

  async updateRelations({ modelId, type, typeId }: UpdateRelationsProps) {
    try {
      await Category.findByIdAndUpdate(modelId, {
        $push: { [type]: typeId },
      });
    } catch (error) {
      throw new Error(`${type} not updated`);
    }
  }

  async removeRelations({ modelId, type, typeId }: UpdateRelationsProps) {
    try {
      await Category.findByIdAndUpdate(modelId, {
        $pull: { [type]: typeId },
      });
    } catch (error) {
      throw new Error(`${type} not removed`);
    }
  }
}
