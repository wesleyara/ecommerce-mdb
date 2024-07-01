import { Product } from "../models/ProductModel";

export class ProductRepository {
  async findProducts() {
    const response = await Product.find();

    return response;
  }

  async findProductByOwnerId(owner_id: unknown) {
    const response = await Product.find({ owner_id });

    return response;
  }
}
