import { Product } from "../models/ProductModel";
import {
  RepositoryCreateProduct,
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
}
