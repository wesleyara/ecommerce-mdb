import { Product } from "../models/ProductModel";

export class ProductRepository {
  async findProductByOwnerId(owner_id: string) {
    const response = await Product.find({ owner_id });

    return response;
  }
}