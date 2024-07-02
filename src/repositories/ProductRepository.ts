import { Product } from "../models/ProductModel";
import { RepositoryCreateProduct } from "../types";

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
}
