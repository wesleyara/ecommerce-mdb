import { verifyToken } from "../lib/jwt";
import { AccountRepository } from "../repositories/AccountRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import {
  CreateProductProps,
  DeleteProductProps,
  EditProductProps,
} from "../types";

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
      account.id,
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
      owner_id: account.id,
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

    if (product.ownerId !== account.id) {
      throw new Error("Unauthorized");
    }

    const { title, description, price, category_id, remove_category } = data;

    let brlPrice = "";
    if (price) {
      const formattedPrice = parseFloat(price);
      if (isNaN(formattedPrice)) {
        throw new Error("Invalid price");
      }

      brlPrice = `R$ ${formattedPrice.toFixed(2)}`;
    }

    const categoryId = remove_category ? undefined : category_id || undefined;
    if (categoryId) {
      const category = await this.categoryRepository.findCategoryById(
        categoryId,
      );
      if (!category) {
        throw new Error("Category not found");
      }
    }

    const response = await this.productRepository.updateProduct({
      productId: product.id,
      data: {
        title,
        description,
        price: brlPrice || undefined,
        categoryId,
      },
      remove_category,
    });

    return response;
  }

  async deleteProduct({ token, productId }: DeleteProductProps) {
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

    if (product.ownerId !== account.id) {
      throw new Error("Unauthorized");
    }

    await this.productRepository.deleteProductById(product.id);

    return product;
  }
}
