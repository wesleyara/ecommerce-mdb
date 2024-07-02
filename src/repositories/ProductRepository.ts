import { Product } from "../models/ProductModel";
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
    const product = await Product.create({
      title,
      description,
      price,
      owner_id,
    });

    await product.save();

    return product;
  }

  async findProducts() {
    const response = await Product.find();

    return response;
  }

  async findProductsByOwnerId(owner_id: unknown) {
    const response = await Product.find({ owner_id });

    return response;
  }

  async findProductById(productId: unknown) {
    const product = await Product.findById(productId);

    return product;
  }

  async findProductsByCategoryId(category_id: unknown) {
    const products = await Product.find({ category: category_id });

    return products;
  }

  async updateProduct({
    productId,
    title,
    description,
    price,
    category_id,
    remove_category,
  }: RepositoryUpdateProduct) {
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        category: remove_category ? null : category_id,
      },
      { new: true },
    );

    return product;
  }

  async updateManyProducts({
    productIds,
    category_id,
    remove_category,
  }: RepositoryUpdateManyProducts) {
    const products = await Product.updateMany(
      { _id: { $in: productIds } },
      {
        category: remove_category ? null : category_id,
      },
    );

    return products;
  }

  async deleteProductById(productId: unknown) {
    const product = await Product.findByIdAndDelete(productId);

    return product;
  }
}
