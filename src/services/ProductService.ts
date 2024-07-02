import { verifyToken } from "../lib/jwt";
import { AccountRepository } from "../repositories/AccountRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { CreateProductProps, EditProductProps } from "../types";

export class ProductService {
  constructor(
    private accountRepository = new AccountRepository(),
    private productRepository = new ProductRepository(),
    private categoryRepository = new CategoryRepository(),
  ) {}

  async findProducts() {
    const products = await this.productRepository.findProducts();

    return products;
  }

  async createProduct({
    token,
    title,
    description,
    price,
  }: CreateProductProps) {
    const formattedPrice = parseFloat(price);
    if (isNaN(formattedPrice)) {
      throw new Error("Invalid price");
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error("Account not found");
    }

    const products = await this.productRepository.findProductsByOwnerId(
      account._id,
    );
    const productExists = products.find(product => product.title === title);
    if (productExists) {
      throw new Error("Product already exists");
    }

    const brlPrice = `R$ ${formattedPrice.toFixed(2)}`;

    const product = await this.productRepository.createProduct({
      title,
      description,
      price: brlPrice,
      owner_id: account._id,
    });

    await this.accountRepository.updateRelations({
      modelId: account._id,
      type: "products",
      typeId: product._id,
    });

    return product;
  }

  async updateProduct({ token, productId, data }: EditProductProps) {
    const decoded: any = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error("Account not found");
    }

    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.owner_id?.toString() !== account._id?.toString()) {
      throw new Error("Unauthorized");
    }

    const { title, description, price, category_id } = data;

    if (title) {
      product.title = title;
    }

    if (description) {
      product.description = description;
    }

    if (price) {
      const formattedPrice = parseFloat(price);
      if (isNaN(formattedPrice)) {
        throw new Error("Invalid price");
      }

      const brlPrice = `R$ ${formattedPrice.toFixed(2)}`;
      product.price = brlPrice;
    }

    if (category_id) {
      if (product.category) {
        throw new Error("Category already set");
      }

      await this.categoryRepository.updateRelations({
        modelId: category_id,
        type: "products",
        typeId: product._id,
      });
    }

    const response = await this.productRepository.updateProduct({
      productId: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      category_id: category_id || product.category,
    });

    return response;
  }
}
